import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Readable } from 'stream';

export interface UploadFileOptions {
  key: string;
  file: Buffer | Readable;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface PresignedUrlOptions {
  key: string;
  expiresIn?: number; // seconds, default 3600 (1 hour)
}

@Injectable()
export class R2Service implements OnModuleInit {
  private s3Client: S3Client;
  private bucketName: string;

  onModuleInit() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    this.bucketName = process.env.R2_BUCKET_NAME || '';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.warn('⚠️  R2 credentials not configured');
      return;
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    console.log('✅ Cloudflare R2 configured successfully');
  }

  /**
   * Upload a file to R2
   */
  async uploadFile(options: UploadFileOptions): Promise<{ key: string; url: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: options.key,
      Body: options.file,
      ContentType: options.contentType,
      Metadata: options.metadata,
    });

    await this.s3Client.send(command);

    const url = await this.getPublicUrl(options.key);

    console.log(`✅ File uploaded: ${options.key}`);

    return { key: options.key, url };
  }

  /**
   * Download a file from R2
   */
  async downloadFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);

    console.log(`✅ File deleted: ${key}`);
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string) {
    const command = new HeadObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);

    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    };
  }

  /**
   * Generate presigned URL for upload
   */
  async getPresignedUploadUrl(options: PresignedUrlOptions): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: options.key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: options.expiresIn || 3600,
    });
  }

  /**
   * Generate presigned URL for download
   */
  async getPresignedDownloadUrl(options: PresignedUrlOptions): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: options.key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: options.expiresIn || 3600,
    });
  }

  /**
   * Get public URL (if bucket has public access)
   */
  async getPublicUrl(key: string): Promise<string> {
    const publicDomain = process.env.R2_PUBLIC_DOMAIN;

    if (publicDomain) {
      return `https://${publicDomain}/${key}`;
    }

    // Fallback to R2.dev subdomain if configured
    const accountId = process.env.R2_ACCOUNT_ID;
    return `https://pub-${accountId}.r2.dev/${key}`;
  }

  /**
   * Upload file with automatic key generation
   */
  async uploadWithAutoKey(
    file: Buffer | Readable,
    originalName: string,
    contentType?: string
  ): Promise<{ key: string; url: string }> {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = originalName.split('.').pop();
    const key = `uploads/${timestamp}-${randomString}.${extension}`;

    return this.uploadFile({ key, file, contentType });
  }
}
