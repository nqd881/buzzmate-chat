import {
  ChatFilePath,
  IFileStorageService,
} from "@application/ports/interface/file-storage";
import { CreateReadStreamOptions } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { GCloudStorageService } from "../gcloud-storage/gcloud-storage.service";

@Injectable()
export class FileStorageService implements IFileStorageService {
  constructor(private readonly gcsService: GCloudStorageService) {}

  private resolvePath(path: ChatFilePath) {
    const { chatId, fileId } = path;

    return [chatId.value, fileId.value].join("/");
  }

  async copyChatFile(
    sourcePath: ChatFilePath,
    destPath: ChatFilePath
  ): Promise<any> {
    const sourceFilePath = this.resolvePath(sourcePath);

    const destFilePath = this.resolvePath(destPath);

    const sourceFile = this.gcsService.getFile(sourceFilePath);

    const destFile = this.gcsService.getFile(destFilePath);

    return sourceFile.copy(destFile);
  }

  saveChatFile(path: ChatFilePath, content: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const stringPath = this.resolvePath(path);

      const gcsFile = this.gcsService.getFile(stringPath);

      const writeStream = gcsFile.createWriteStream();

      writeStream.on("finish", () => {
        resolve();
      });

      writeStream.on("error", (error) => {
        reject();
      });

      writeStream.end(content);
    });
  }

  getChatFileReadStream(
    path: ChatFilePath,
    options?: CreateReadStreamOptions
  ): NodeJS.ReadableStream {
    const stringPath = this.resolvePath(path);

    const gcsFile = this.gcsService.getFile(stringPath);

    return gcsFile.createReadStream(options);
  }
}
