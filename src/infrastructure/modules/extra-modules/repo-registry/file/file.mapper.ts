import { File, FileId } from "@domain/models/file/file";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbFile } from "./file.schema";

@Injectable()
export class FileMapper implements IDomainPersistenceMapper<File, DbFile> {
  toPersistence(entity: File): DbFile {
    if (!entity) return null;

    const { id, name, mimetype, size, date, version } = entity;

    return {
      _id: id.value,
      name,
      mimetype,
      size,
      date,
      __version: version,
    };
  }

  toDomain(dbModel: DbFile): File {
    if (!dbModel) return null;

    const { _id, name, mimetype, size, date, __version } = dbModel;

    return new File(
      {
        name,
        mimetype,
        size,
        date,
      },
      __version,
      new FileId(_id)
    );
  }
}
