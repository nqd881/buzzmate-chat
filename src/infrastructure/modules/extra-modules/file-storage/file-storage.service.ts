import { IFileStorageService } from "@application/ports/interface/file-storage";
import { ChatId } from "@domain/models/chat/chat";
import { File, FileId } from "@domain/models/file/file";
import { Storage as GCloudStorage } from "@google-cloud/storage";
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

  saveChatFile(chatId: ChatId, file: File, content: Buffer) {
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
    });

    writeStream.on("error", (error) => {
      console.log("Upload error", error);
    });

    writeStream.end(content);
  }

  getChatFileReadStream(chatId: ChatId, fileId: FileId): NodeJS.ReadableStream {
    const path = this.getChatFilePath(chatId, fileId);

    const gcsFile = this.gcsService.getFile(path);

    return gcsFile.createReadStream();
  }
}
