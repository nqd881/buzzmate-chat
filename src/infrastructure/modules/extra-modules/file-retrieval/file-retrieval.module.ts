import { Module } from "@nestjs/common";
import { FileRetrievalService } from "./file-retrieval.service";
import { GCloudStorageModule } from "../gcloud-storage/gcloud-storage.module";
import { Ports } from "@application/ports/constants";

@Module({
  imports: [GCloudStorageModule],
  providers: [
    { provide: Ports.FileRetrievalService, useClass: FileRetrievalService },
  ],
  exports: [Ports.FileRetrievalService],
})
export class FileRetrievalModule {}
