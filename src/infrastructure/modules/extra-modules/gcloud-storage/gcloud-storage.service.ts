import {Storage} from "@google-cloud/storage";
import {EnvNames} from "@infrastructure/env/env.name";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class GCloudStorageService {
  constructor(
    private readonly env: ConfigService,
    private readonly storage: Storage
  ) {}

  getFile(path: string) {
    const bucketName = this.env.get(EnvNames.GCLOUD_STORAGE_BUCKET_NAME);

    const bucket = this.storage.bucket(bucketName);

    const gcsFile = bucket.file(path);

    return gcsFile;
  }
}
