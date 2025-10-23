# Cloudflare R2 Storage Setup Guide

## 🌥️ What is Cloudflare R2?

Cloudflare R2 is an S3-compatible object storage service with **zero egress fees**.

### Why R2 over AWS S3?

| Feature          | Cloudflare R2               | AWS S3       |
| ---------------- | --------------------------- | ------------ |
| **Storage Cost** | $0.015/GB                   | $0.023/GB    |
| **Egress Cost**  | **$0 (FREE!)**              | $0.09/GB     |
| **Free Tier**    | 10 GB storage               | 5 GB storage |
| **API**          | S3-compatible               | Native S3    |
| **Speed**        | Cloudflare's global network | AWS regions  |

**TL;DR:** R2 is cheaper and has no data transfer fees! 🎉

---

## 💰 Pricing (Free Tier)

### Always Free

- ✅ **10 GB** storage per month
- ✅ **1 million** Class A operations (PUT, LIST, DELETE)
- ✅ **10 million** Class B operations (GET, HEAD)
- ✅ **Zero egress fees** (downloads are free!)

### Paid Plans (if you exceed free tier)

- $0.015/GB storage
- $4.50 per million Class A operations
- $0.36 per million Class B operations
- Still **no egress fees**!

---

## 📦 Installed Packages

| Package                         | Version  | Purpose                 |
| ------------------------------- | -------- | ----------------------- |
| `@aws-sdk/client-s3`            | ^3.916.0 | S3 client for R2        |
| `@aws-sdk/s3-request-presigner` | ^3.916.0 | Generate presigned URLs |

---

## 🚀 Quick Start

### 1. Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **R2** from sidebar
3. Click **Create bucket**
4. Name your bucket (e.g., `emma-project-uploads`)
5. Click **Create bucket**

### 2. Get API Credentials

1. In R2 dashboard, click **Manage R2 API Tokens**
2. Click **Create API token**
3. Name it (e.g., "Emma Project")
4. Set permissions: **Object Read & Write**
5. Click **Create API Token**
6. **Save these values:**
   - Access Key ID
   - Secret Access Key
   - Account ID

### 3. Configure Environment Variables

Add to your `.env` file:

```env
# Cloudflare R2 Storage
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"

# Optional: Custom domain for public URLs
R2_PUBLIC_DOMAIN="cdn.yourdomain.com"
```

### 4. Import R2Service in Your Module

```typescript
// apps/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { R2Service } from '../storage/r2.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [R2Service],
  exports: [R2Service],
})
export class AppModule {}
```

---

## 💻 Usage Examples

### Upload File

```typescript
import { R2Service } from '../storage/r2.service';

@Injectable()
export class UploadService {
  constructor(private r2Service: R2Service) {}

  async uploadUserAvatar(userId: string, file: Buffer) {
    const result = await this.r2Service.uploadFile({
      key: `avatars/${userId}.jpg`,
      file,
      contentType: 'image/jpeg',
      metadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    console.log('File URL:', result.url);
    return result;
  }
}
```

### Upload with Auto-generated Key

```typescript
async uploadDocument(file: Express.Multer.File) {
  const result = await this.r2Service.uploadWithAutoKey(
    file.buffer,
    file.originalname,
    file.mimetype
  );

  return result;
}
```

### Download File

```typescript
async downloadFile(key: string) {
  const buffer = await this.r2Service.downloadFile(key);
  return buffer;
}
```

### Delete File

```typescript
async deleteFile(key: string) {
  await this.r2Service.deleteFile(key);
}
```

### Check if File Exists

```typescript
const exists = await this.r2Service.fileExists('avatars/user-123.jpg');
if (exists) {
  console.log('File found!');
}
```

### Get File Metadata

```typescript
const metadata = await this.r2Service.getFileMetadata('avatars/user-123.jpg');
console.log('Size:', metadata.contentLength);
console.log('Type:', metadata.contentType);
console.log('Modified:', metadata.lastModified);
```

### Generate Presigned URL for Upload

```typescript
// Frontend uploads directly to R2
const uploadUrl = await this.r2Service.getPresignedUploadUrl({
  key: 'uploads/file.pdf',
  expiresIn: 3600, // 1 hour
});

// Send URL to frontend
return { uploadUrl };
```

### Generate Presigned URL for Download

```typescript
// Temporary download link
const downloadUrl = await this.r2Service.getPresignedDownloadUrl({
  key: 'documents/secret.pdf',
  expiresIn: 300, // 5 minutes
});

return { downloadUrl };
```

---

## 🎯 Complete Example: File Upload API

```typescript
// apps/src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { R2Service } from '../storage/r2.service';

@Controller('files')
export class UploadController {
  constructor(private r2Service: R2Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.r2Service.uploadWithAutoKey(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    return {
      success: true,
      key: result.key,
      url: result.url,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Get(':key')
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    const buffer = await this.r2Service.downloadFile(key);
    const metadata = await this.r2Service.getFileMetadata(key);

    res.setHeader('Content-Type', metadata.contentType);
    res.setHeader('Content-Length', metadata.contentLength);
    res.send(buffer);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.r2Service.deleteFile(key);
    return { success: true, message: 'File deleted' };
  }

  @Get('presign/upload/:filename')
  async getUploadUrl(@Param('filename') filename: string) {
    const key = `uploads/${Date.now()}-${filename}`;
    const url = await this.r2Service.getPresignedUploadUrl({ key });

    return { uploadUrl: url, key };
  }

  @Get('presign/download/:key')
  async getDownloadUrl(@Param('key') key: string) {
    const url = await this.r2Service.getPresignedDownloadUrl({
      key,
      expiresIn: 300,
    });

    return { downloadUrl: url };
  }
}
```

---

## 🌐 Frontend Integration

### Direct Upload to R2

```typescript
// Get presigned URL from backend
const response = await fetch('/api/files/presign/upload/myfile.pdf');
const { uploadUrl, key } = await response.json();

// Upload directly to R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': file.type,
  },
});

console.log('File uploaded:', key);
```

### Upload via Backend

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log('File URL:', result.url);
```

### With React Dropzone

```typescript
import { useDropzone } from 'react-dropzone';

function FileUpload() {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Uploaded:', result.url);
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag files here or click to select</p>
    </div>
  );
}
```

---

## 🔒 Public vs Private Access

### Public Bucket

Make files publicly accessible:

1. In R2 dashboard, select your bucket
2. Click **Settings**
3. Under **Public access**, click **Allow Access**
4. Get your public domain (e.g., `pub-xxx.r2.dev`)
5. Add to `.env`: `R2_PUBLIC_DOMAIN="pub-xxx.r2.dev"`

### Custom Domain (Recommended)

1. In R2 dashboard, select your bucket
2. Click **Settings** → **Custom Domains**
3. Add your domain (e.g., `cdn.yourdomain.com`)
4. Add CNAME record in Cloudflare DNS
5. Update `.env`: `R2_PUBLIC_DOMAIN="cdn.yourdomain.com"`

### Private Access (Default)

Files are private by default. Use presigned URLs for access:

```typescript
const url = await r2Service.getPresignedDownloadUrl({
  key: 'private/document.pdf',
  expiresIn: 300, // 5 minutes
});
```

---

## 🎨 Database Integration

Store file metadata in your database:

```prisma
// prisma/schema.prisma
model File {
  id          String   @id @default(cuid())
  key         String   @unique
  filename    String
  mimetype    String
  size        Int
  url         String
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("files")
}
```

Then in your service:

```typescript
async uploadAndSaveFile(file: Express.Multer.File, userId: string) {
  // Upload to R2
  const result = await this.r2Service.uploadWithAutoKey(
    file.buffer,
    file.originalname,
    file.mimetype
  );

  // Save to database
  const fileRecord = await db.file.create({
    data: {
      key: result.key,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: result.url,
      userId,
    },
  });

  return fileRecord;
}
```

---

## ⚡ Performance Tips

1. **Use presigned URLs** for large files (avoid proxying through backend)
2. **Enable CDN** by using custom domain
3. **Compress images** before uploading
4. **Set cache headers** for static assets
5. **Use parallel uploads** for multiple files

---

## 🐛 Troubleshooting

### "R2 credentials not configured"

**Solution:** Add R2 credentials to `.env` file

### "Access Denied"

**Check:**

1. API token has correct permissions
2. Bucket name is correct
3. Access key ID and secret are correct

### "Bucket not found"

**Solution:** Verify `R2_BUCKET_NAME` matches your bucket name exactly

### CORS Errors (Frontend uploads)

Configure CORS in R2:

1. Go to bucket → Settings → CORS policy
2. Add allowed origins, methods, headers

---

## 📊 Monitoring Usage

View R2 usage in dashboard:

1. Go to R2 → Bucket
2. Click **Metrics**
3. View storage, operations, bandwidth

Set up billing alerts:

1. Account → Billing
2. Set usage notifications

---

## 🚢 Production Checklist

- [ ] R2 bucket created
- [ ] API tokens generated
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] CORS policy configured (if needed)
- [ ] File size limits enforced
- [ ] Error handling implemented
- [ ] Database schema for file metadata
- [ ] Cleanup job for old files (optional)

---

## 📚 Resources

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Presigned URLs Guide](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)

---

## 💡 Summary

✅ **No AWS required** - Completely independent service  
✅ **S3-compatible** - Use AWS SDK without AWS account  
✅ **Free tier** - 10 GB storage, no egress fees  
✅ **Easy setup** - Just credentials needed  
✅ **Fast** - Cloudflare's global network

**Your file storage is ready!** 📦✨
