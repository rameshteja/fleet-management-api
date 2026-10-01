export interface StorageService {
  upload(file: Express.Multer.File, folder: string): Promise<string>;

  delete(filePath: string): Promise<void>;
}
