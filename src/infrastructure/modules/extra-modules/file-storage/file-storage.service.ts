import {
  IFileStorageService,
  MessageFilePath,
} from "@application/ports/interface/file-storage";
import { File } from "@domain/models/file";
import { CreateReadStreamOptions } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { GCloudStorageService } from "../gcloud-storage/gcloud-storage.service";

@Injectable()
export class FileStorageService implements IFileStorageService {
  constructor(private readonly gcsService: GCloudStorageService) {}

  private resolveMessageFilePath(path: MessageFilePath) {
    const { chatId, messageId } = path;

    return [chatId.value, messageId.value].join("/");
  }

  createMessageFileReadStream(
    path: MessageFilePath,
    options?: CreateReadStreamOptions
  ) {
    const stringPath = this.resolveMessageFilePath(path);

    const gcsFile = this.gcsService.getFile(stringPath);

    return gcsFile.createReadStream(options);
  }

  saveMessageFile(
    path: MessageFilePath,
    file: File,
    content: Buffer
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const stringPath = this.resolveMessageFilePath(path);

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

  async copyMessageFile(
    sourcePath: MessageFilePath,
    destPath: MessageFilePath
  ) {
    const stringSourcePath = this.resolveMessageFilePath(sourcePath);

    const stringDestPath = this.resolveMessageFilePath(destPath);

    const sourceFile = this.gcsService.getFile(stringSourcePath);

    const destFile = this.gcsService.getFile(stringDestPath);

    return sourceFile.copy(destFile);
  }
}
