import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface S3Config {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  forcePathStyle?: boolean;
}

export interface GetSignedUrlOptions {
  key: string;
  expiresIn?: number;
}

export interface PutSignedUrlOptions {
  key: string;
  expiresIn?: number;
  contentType?: string;
  maxContentLength?: number;
  metadata?: Record<string, string>;
}

/**
 * Create S3 helper with preconfigured client and bucket
 */
export function createS3Helper(config: S3Config) {
  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: config.forcePathStyle ?? true,
  });

  const bucket = config.bucket;

  return {
    /**
     * Generate presigned URL for GET operation
     */
    getPresignedGetUrl: async (
      options: GetSignedUrlOptions,
    ): Promise<string> => {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: options.key,
      });

      return getSignedUrl(client, command, {
        expiresIn: options.expiresIn ?? 3600,
      });
    },

    /**
     * Generate presigned URL for PUT operation
     */
    getPresignedPutUrl: async (
      options: PutSignedUrlOptions,
    ): Promise<string> => {
      const commandOptions: PutObjectCommandInput = {
        Bucket: bucket,
        Key: options.key,
      };

      if (options.contentType) {
        commandOptions.ContentType = options.contentType;
      }

      if (options.maxContentLength !== undefined) {
        commandOptions.ContentLength = options.maxContentLength;
      }

      if (options.metadata) {
        commandOptions.Metadata = options.metadata;
      }

      const command = new PutObjectCommand(commandOptions);

      return getSignedUrl(client, command, {
        expiresIn: options.expiresIn ?? 3600,
      });
    },
  };
}

/**
 * Default S3 helper instance using environment variables
 */
const defaultS3Helper = createS3Helper({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION!,
  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  bucket: process.env.S3_BUCKET!,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
});

/**
 * Get default S3 configuration
 */
export function getS3Config() {
  return {
    endpoint: process.env.S3_ENDPOINT!,
    bucket: process.env.S3_BUCKET!,
  };
}

/**
 * Generate object URL (host + key)
 */
export function getObjectUrl(key: string): string {
  const config = getS3Config();
  const endpoint = config.endpoint.replace(/\/$/, "");
  return `${endpoint}/${config.bucket}/${key}`;
}

/**
 * Generate presigned URL for GET operation (using default config)
 */
export const getPresignedGetUrl = defaultS3Helper.getPresignedGetUrl;

/**
 * Generate presigned URL for PUT operation (using default config)
 */
export const getPresignedPutUrl = defaultS3Helper.getPresignedPutUrl;
