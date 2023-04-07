import {ChatId} from "@domain/models/chat/chat";
import {FileId} from "@domain/models/file/file";
import {Photo, PhotoId} from "@domain/models/photo/photo";
import {PhotoSize} from "@domain/models/photo/photo-size";
import {IDomainPersistenceMapper} from "@libs/ddd";
import {Injectable} from "@nestjs/common";
import {DbPhoto, DbPhotoSize} from "./photo.schema";

@Injectable()
export class PhotoMapper implements IDomainPersistenceMapper<Photo, DbPhoto> {
  private photoSizeToPersistence(
    type: string,
    photoSize: PhotoSize
  ): DbPhotoSize {
    const {width, height, fileId} = photoSize;

    return {
      type,
      width,
      height,
      fileId: fileId.value,
    };
  }

  private photoSizeToDomain(dbPhotoSize: DbPhotoSize): PhotoSize {
    const {width, height, fileId} = dbPhotoSize;

    return new PhotoSize({
      width,
      height,
      fileId: new FileId(fileId),
    });
  }

  toPersistence(entity: Photo): DbPhoto {
    if (!entity) return null;

    const {id, chatId, original, variants, version} = entity;

    return {
      _id: id.value,
      chatId: chatId.value,
      original: this.photoSizeToPersistence("original", original),
      variants: Object.entries(variants).map(([variantType, photoSize]) => {
        return this.photoSizeToPersistence(variantType, photoSize as PhotoSize);
      }),
      __version: version,
    };
  }

  toDomain(dbModel: DbPhoto): Photo {
    if (!dbModel) return null;

    const {_id, chatId, original, variants, __version} = dbModel;

    return new Photo(
      {
        chatId: new ChatId(chatId),
        original: this.photoSizeToDomain(original),
        variants: new Map(
          (variants || []).map((variant) => [
            variant.type,
            this.photoSizeToDomain(variant),
          ])
        ),
      },
      __version,
      new PhotoId(_id)
    );
  }
}
