import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService {
  private readonly s3: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET');
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: this.configService.get<string>('MINIO_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY'),
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    filename?: string,
  ): Promise<string> {
    const key = filename || `uploads/${uuidv4()}-${file.originalname}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return key;
  }

  async getSignedUrl(key: string, expiresIn = 800): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  getPublicUrl(key: string): string {
    const endpoint =
      this.configService.get<string>('MINIO_PUBLIC_ENDPOINT') ||
      this.configService.get<string>('MINIO_ENDPOINT');
    const cleanedEndpoint = endpoint.replace(/\/$/, '');

    return `${cleanedEndpoint}/${this.bucketName}/${key}`;
  }
}
