import {Storage} from "@google-cloud/storage";
import {EnvNames} from "@infrastructure/env/env.name";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {GCloudStorageService} from "./gcloud-storage.service";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Storage,
      useFactory: (env: ConfigService) => {
        return new Storage({
          projectId: env.get(EnvNames.GCLOUD_PROJECT_ID),
          credentials: {
            client_email: env.get(EnvNames.GCLOUD_CLIENT_EMAIL),
            private_key: env.get(EnvNames.GCLOUD_PRIVATE_KEY),
          },
        });
      },
      inject: [ConfigService],
    },
    GCloudStorageService,
  ],
  exports: [Storage, GCloudStorageService],
})
export class GCloudStorageModule {}
