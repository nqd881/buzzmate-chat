import {Ports} from "@application/ports/constants";
import {Module} from "@nestjs/common";
import {GCloudStorageModule} from "../gcloud-storage/gcloud-storage.module";
import {FileStorageService} from "./file-storage.service";

@Module({
  imports: [GCloudStorageModule],
  providers: [
    {
      provide: Ports.FileStorageService,
      useClass: FileStorageService,
    },
  ],
  exports: [Ports.FileStorageService],
})
export class FileStorageModule {}
