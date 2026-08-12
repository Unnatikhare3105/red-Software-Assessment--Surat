import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/s3.config';
import { config } from '../config/env.config';
import { generateUuid } from '../utils/generateUUID';
import { ApiError } from '../utils/ApiError';

export const uploadService = {
  async uploadProductImage(file: Express.Multer.File): Promise<string> {
    if (!config.aws.bucketName) {
      throw ApiError.internal('Image upload is not configured (missing AWS_BUCKET_NAME)');
    }

    const key = `products/${generateUuid()}-${file.originalname}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: config.aws.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
  },
};