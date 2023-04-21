import { IFileStorageService } from "@application/ports/interface/file-storage";
import { ChatId } from "@domain/models/chat/chat";
import { File, FileId } from "@domain/models/file/file";
import {
  CreateReadStreamOptions,
  Storage as GCloudStorage,
} from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { GCloudStorageService } from "../gcloud-storage/gcloud-storage.service";

@Injectable()
export class FileStorageService implements IFileStorageService {
  constructor(
    private readonly gcs: GCloudStorage,
    private readonly gcsService: GCloudStorageService
  ) {}

  private getChatFilePath(chatId: ChatId, fileId: FileId) {
    return [chatId.value, fileId.value].join("/");
  }

  async copyChatFile(
    sourceChatId: ChatId,
    sourceFileId: FileId,
    destChatId: ChatId,
    destFileId: FileId
  ): Promise<any> {
    const sourceFilePath = this.getChatFilePath(sourceChatId, sourceFileId);

    const destFilePath = this.getChatFilePath(destChatId, destFileId);

    const sourceFile = this.gcsService.getFile(sourceFilePath);

    const destFile = this.gcsService.getFile(destFilePath);

    return sourceFile.copy(destFile);
  }

  saveChatFile(chatId: ChatId, file: File, content: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = this.getChatFilePath(chatId, file.id);

      const gcsFile = this.gcsService.getFile(path);

      const writeStream = gcsFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      writeStream.on("finish", () => {
        gcsFile.setMetadata({
          id: file.id.value,
        });

        console.log("Upload success");

        resolve();
      });

      writeStream.on("error", (error) => {
        console.log("Upload error", error);

        reject();
      });

      writeStream.end(content);
    });
  }

  getChatFileReadStream(
    chatId: ChatId,
    fileId: FileId,
    options?: CreateReadStreamOptions
  ): NodeJS.ReadableStream {
    const path = this.getChatFilePath(chatId, fileId);

    const gcsFile = this.gcsService.getFile(path);

    return gcsFile.createReadStream(options);
  }
}
