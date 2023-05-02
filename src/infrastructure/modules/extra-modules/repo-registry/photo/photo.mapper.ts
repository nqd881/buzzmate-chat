import { FileId } from "@domain/models/file/file";
import { Photo, PhotoId } from "@domain/models/photo/photo";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbPhoto } from "./photo.schema";

@Injectable()
export class PhotoMapper implements IDomainPersistenceMapper<Photo, DbPhoto> {
  toPersistence(entity: Photo): DbPhoto {
    if (!entity) return null;

    const { id, width, height, fileId, version } = entity;

    return {
      _id: id.value,
      width,
      height,
      fileId: fileId.value,
      __version: version,
    };
  }

  toDomain(dbModel: DbPhoto): Photo {
    if (!dbModel) return null;

    const { _id, width, height, fileId, __version } = dbModel;

    return new Photo(
      {
        width,
        height,
        fileId: new FileId(fileId),
      },
      __version,
      new PhotoId(_id)
    );
  }
}
