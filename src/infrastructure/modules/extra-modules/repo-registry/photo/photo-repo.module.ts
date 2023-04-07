import {DomainPersistenceMappers} from "@application/di-tokens/domain-persistence-mappers";
import {Repositories} from "@application/di-tokens/repositories";
import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {PhotoMapper} from "./photo.mapper";
import {PhotoRepository} from "./photo.repository";
import {DbPhoto, DbPhotoSchema} from "./photo.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbPhoto.name, schema: DbPhotoSchema}]),
  ],
  providers: [
    {provide: Repositories.Photo, useClass: PhotoRepository},
    {provide: DomainPersistenceMappers.Photo, useClass: PhotoMapper},
  ],
  exports: [Repositories.Photo],
})
export class PhotoRepoModule {}
