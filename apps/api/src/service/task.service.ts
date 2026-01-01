import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { generateText, ModelMessage } from "ai";

import { PrismaService } from "../db-provider";
import { ChatMessageRole, TaskResourceType, TaskStatus, TaskTitle } from "../enum";
import { ERROR_MESSAGE } from "../exception";
import {
  generateStorageKey,
  generateUUID,
  getExtensionFromMediaType,
  getObjectUrl,
  getPresignedPutUrl,
  HttpHeader,
  HttpMethod,
  StorageKeyPrefix,
  UUIDType,
} from "../util";

interface NanoBananaProInput {
  prompt: string;
  aspect_ratio: string;
  resolution: string;
  created_by: string;
  images?: string[];
}

interface ImageDimensions {
  width: number;
  height: number;
}

const IMAGE_DIMENSIONS_MAP: Record<string, Record<string, ImageDimensions>> = {
  "1:1": {
    "1K": { width: 1024, height: 1024 },
    "2K": { width: 2048, height: 2048 },
    "4K": { width: 4096, height: 4096 },
  },
  "2:3": {
    "1K": { width: 848, height: 1264 },
    "2K": { width: 1696, height: 2528 },
    "4K": { width: 3392, height: 5056 },
  },
  "3:2": {
    "1K": { width: 1264, height: 848 },
    "2K": { width: 2528, height: 1696 },
    "4K": { width: 5056, height: 3392 },
  },
  "3:4": {
    "1K": { width: 896, height: 1200 },
    "2K": { width: 1792, height: 2400 },
    "4K": { width: 3584, height: 4800 },
  },
  "4:3": {
    "1K": { width: 1200, height: 896 },
    "2K": { width: 2400, height: 1792 },
    "4K": { width: 4800, height: 3584 },
  },
  "4:5": {
    "1K": { width: 928, height: 1152 },
    "2K": { width: 1856, height: 2304 },
    "4K": { width: 3712, height: 4608 },
  },
  "5:4": {
    "1K": { width: 1152, height: 928 },
    "2K": { width: 2304, height: 1856 },
    "4K": { width: 4608, height: 3712 },
  },
  "9:16": {
    "1K": { width: 768, height: 1376 },
    "2K": { width: 1536, height: 2752 },
    "4K": { width: 3072, height: 5504 },
  },
  "16:9": {
    "1K": { width: 1376, height: 768 },
    "2K": { width: 2752, height: 1536 },
    "4K": { width: 5504, height: 3072 },
  },
  "21:9": {
    "1K": { width: 1584, height: 672 },
    "2K": { width: 3168, height: 1344 },
    "4K": { width: 6336, height: 2688 },
  },
};

function getImageDimensions(aspectRatio: string, resolution: string): ImageDimensions {
  const dimensions = IMAGE_DIMENSIONS_MAP[aspectRatio]?.[resolution];
  if (!dimensions) {
    throw new BadRequestException(ERROR_MESSAGE.ValidationFailed);
  }
  return dimensions;
}

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  private readonly google;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // Initialize Google Generative AI provider
    this.google = createGoogleGenerativeAI({
      apiKey: this.configService.get<string>("GOOGLE_GENERATIVE_AI_API_KEY") || "",
    });
  }

  async createNanoBananaProTask(input: NanoBananaProInput) {
    const taskUuid = generateUUID(UUIDType.TASK);
    const dimensions = getImageDimensions(input.aspect_ratio, input.resolution);
    const isImageToImage = !!input.images && input.images.length > 0;

    // Step 1: Create task
    await this.prisma.task.create({
      data: {
        uuid: taskUuid,
        title: isImageToImage ? TaskTitle.IMAGE_TO_IMAGE : TaskTitle.TEXT_TO_IMAGE,
        meta: {},
        payload: {
          prompt: input.prompt,
          aspect_ratio: input.aspect_ratio,
          resolution: input.resolution,
          ...(isImageToImage && { images: input.images }),
        },
        status: TaskStatus.PENDING as string,
        created_by: input.created_by,
        updated_by: input.created_by,
      },
    });

    // Step 3: Update task status to processing
    await this.prisma.task.update({
      where: { uuid: taskUuid },
      data: {
        status: TaskStatus.PROCESSING as string,
        updated_by: input.created_by,
      },
    });

    try {
      const messages: ModelMessage[] = [];
      messages.push({
        role: ChatMessageRole.USER,
        content: input.prompt,
      });
      if (input?.images?.length > 0) {
        messages.push({
          role: ChatMessageRole.USER,
          content: input.images.map((image) => ({
            type: TaskResourceType.IMAGE,
            image: image,
          })),
        });
      }
      
      const { files } = await generateText({
        model: this.google("gemini-3-pro-image"),
        messages,
        providerOptions: {
          google: {
            imageConfig: {
              aspectRatio: input.aspect_ratio,
              imageSize: input.resolution,
            },
          },
        },
      });

      // Step 5: Process all generated image files. Filter only supported image formats.
      const supportedImageFiles = files
        .filter((file) => {
          const extension = getExtensionFromMediaType(file.mediaType);
          if (extension === "bin") {
            this.logger.warn(`Unsupported media type: ${file.mediaType}, skipping file`);
            return false;
          }
          return true;
        });

      if (supportedImageFiles.length === 0) {
        throw new BadRequestException(ERROR_MESSAGE.ResourceGenerationFailed);
      }

      // Create image records for all generated images
      for (const imageFile of supportedImageFiles) {
        const imageUuid = generateUUID(UUIDType.IMAGE);

        const key = generateStorageKey({
          prefix: StorageKeyPrefix.IMAGE,
          userId: input.created_by,
          taskId: taskUuid,
          resourceId: imageUuid,
          extension: getExtensionFromMediaType(imageFile.mediaType),
        });

        // Upload image to S3
        const uploadUrl = await getPresignedPutUrl({
          key,
          contentType: imageFile.mediaType,
          maxContentLength: imageFile.uint8Array.length,
          expiresIn: 3600,
        });

        // Upload image data to S3 using the presigned URL
        const uploadResponse = await fetch(uploadUrl, {
          method: HttpMethod.PUT,
          body: imageFile.uint8Array,
          headers: {
            [HttpHeader.CONTENT_TYPE]: imageFile.mediaType,
          },
        });

        if (!uploadResponse.ok) {
          throw new BadRequestException(ERROR_MESSAGE.ResourceGenerationFailed);
        }

        const imageUrl = getObjectUrl(key);

        await this.prisma.image.create({
          data: {
            uuid: imageUuid,
            width: dimensions.width,
            height: dimensions.height,
            aspect_ratio: input.aspect_ratio,
            resolution: input.resolution,
            url: imageUrl,
            thumbnail: imageUrl,
            size: imageFile.uint8Array.length,
            created_by: input.created_by,
            updated_by: input.created_by,
          },
        });

        await this.prisma.taskResourceRelation.create({
          data: {
            uuid: generateUUID(UUIDType.TASK_RESOURCE_RELATION),
            task_uuid: taskUuid,
            resource_type: TaskResourceType.IMAGE,
            resource_uuid: imageUuid,
            created_by: input.created_by,
            updated_by: input.created_by,
          },
        });
      }

      // Step 6: Update task status to completed
      await this.prisma.task.update({
        where: { uuid: taskUuid },
        data: {
          status: TaskStatus.COMPLETED as string,
          updated_by: input.created_by,
        },
      });

      this.logger.log(`${isImageToImage ? 'Image to image' : 'Text to image'} generation completed successfully for task ${taskUuid}`);
    } catch (error) {
      // Step 7: On failure, update task status to failed
      this.logger.error(`Failed to generate image for task ${taskUuid}:`, error);

      await this.prisma.task.update({
        where: { uuid: taskUuid },
        data: {
          status: TaskStatus.FAILED as string,
          updated_by: input.created_by,
        },
      });

      throw new BadRequestException(ERROR_MESSAGE.ResourceGenerationFailed);
    }

    return taskUuid;
  }
}
