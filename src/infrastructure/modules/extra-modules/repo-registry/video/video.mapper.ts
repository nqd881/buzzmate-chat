import { FileId } from "@domain/models/file/file";
import { PhotoId } from "@domain/models/photo/photo";
import { Thumbnail, Video, VideoId } from "@domain/models/video/video";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbVideo } from "./video.schema";

@Injectable()
export class VideoMapper implements IDomainPersistenceMapper<Video, DbVideo> {
  toPersistence(entity: Video): DbVideo {
    if (!entity) return null;

    const { id, duration, width, height, thumbnail, fileId, version } = entity;

    return {
      _id: id.value,
      duration,
      width,
      height,
      thumbnail: {
        photoId: thumbnail?.photoId?.value,
      },
      fileId: fileId.value,
      __version: version,
    };
  }

  toDomain(dbModel: DbVideo): Video {
    if (!dbModel) return null;

    const { _id, duration, width, height, thumbnail, fileId, __version } =
      dbModel;

    return new Video(
      {
        duration,
        width,
        height,
        thumbnail: thumbnail
          ? new Thumbnail({
              photoId: thumbnail?.photoId
                ? new PhotoId(thumbnail.photoId)
                : null,
            })
          : null,
        fileId: new FileId(fileId),
      },
      __version,
      new VideoId(_id)
    );
  }
}
