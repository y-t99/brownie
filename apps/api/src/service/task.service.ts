import { BadRequestException, Injectable, Logger } from "@nestjs/common";

import { PrismaService } from "../db-provider";
import { TaskResourceType, TaskStatus, TaskTitle } from "../enum";
import { ERROR_MESSAGE } from "../exception";
import { generateUUID, UUIDType } from "../util";

interface NanoBananaProInput {
  prompt: string;
  aspect_ratio: string;
  resolution: string;
  created_by: string;
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

  constructor(private readonly prisma: PrismaService) {}

  async createNanoBananaProTask(input: NanoBananaProInput) {
    const taskUuid = generateUUID(UUIDType.TASK);
    const imageUuid = generateUUID(UUIDType.IMAGE);
    const dimensions = getImageDimensions(input.aspect_ratio, input.resolution);

    // Step 1 & 2: Create task, image, and relation in a transaction
    await this.prisma.$transaction([
      this.prisma.task.create({
        data: {
          uuid: taskUuid,
          title: TaskTitle.TEXT_TO_IMAGE,
          meta: {},
          payload: {
            prompt: input.prompt,
            aspect_ratio: input.aspect_ratio,
            resolution: input.resolution,
          },
          status: TaskStatus.PENDING as string,
          created_by: input.created_by,
          updated_by: input.created_by,
        },
      }),
      this.prisma.image.create({
        data: {
          uuid: imageUuid,
          width: dimensions.width,
          height: dimensions.height,
          aspect_ratio: input.aspect_ratio,
          resolution: input.resolution,
          created_by: input.created_by,
          updated_by: input.created_by,
        },
      }),
      this.prisma.taskResourceRelation.create({
        data: {
          uuid: generateUUID(UUIDType.TASK_RESOURCE_RELATION),
          task_uuid: taskUuid,
          resource_type: TaskResourceType.IMAGE,
          resource_uuid: imageUuid,
          created_by: input.created_by,
          updated_by: input.created_by,
        },
      }),
    ]);

    // Step 3: Update task status to processing
    await this.prisma.task.update({
      where: { uuid: taskUuid },
      data: {
        status: TaskStatus.PROCESSING as string,
        updated_by: input.created_by,
      },
    });

    // TODO: Call third-party nano-banana-pro API to generate image
    // TODO: On success, update image record with url, thumbnail, size
    // TODO: On success, update task status to COMPLETED
    // TODO: On failure, update task status to FAILED with error details

    return taskUuid;
  }
}
