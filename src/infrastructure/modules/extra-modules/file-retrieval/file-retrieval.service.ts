import { IFileRetrievalService } from "@application/ports/interface/file-retrieval";
import { Injectable } from "@nestjs/common";
import { GCloudStorageService } from "../gcloud-storage/gcloud-storage.service";
import { CreateReadStreamOptions } from "@google-cloud/storage";

@Injectable()
export class FileRetrievalService implements IFileRetrievalService {
  constructor(private readonly gcsService: GCloudStorageService) {}

  createMessageFileReadStream(
    chatId: string,
    messageId: string,
    options?: CreateReadStreamOptions
  ) {
    const stringPath = [chatId, messageId].join("/");

    const gcsFile = this.gcsService.getFile(stringPath);

    return gcsFile.createReadStream(options);
  }
}
