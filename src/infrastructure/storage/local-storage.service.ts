import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { StorageService } from './storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      const folderPath = join(this.uploadRoot, folder);

      await mkdir(folderPath, {
        recursive: true,
      });

      const extension = file.originalname.split('.').pop()?.toLowerCase();

      const fileName = `${randomUUID()}.${extension || 'bin'}`;

      const filePath = join(folderPath, fileName);

      await writeFile(filePath, file.buffer);

      return `/uploads/${folder}/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file.');
    }
  }

  async delete(filePath: string): Promise<void> {
    try {
      if (!filePath) {
        return;
      }

      const relativePath = filePath.replace(/^\/uploads\//, '');

      const fullPath = join(this.uploadRoot, relativePath);

      await unlink(fullPath);
    } catch (error: any) {
      // File may already be deleted.
      if (error?.code !== 'ENOENT') {
        throw new InternalServerErrorException('Failed to delete file.');
      }
    }
  }
}
