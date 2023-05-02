import { Document, DocumentId } from "@domain/models/document/document";
import { FileId } from "@domain/models/file/file";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbDocument } from "./document.schema";

@Injectable()
export class DocumentMapper
  implements IDomainPersistenceMapper<Document, DbDocument>
{
  toPersistence(entity: Document): DbDocument {
    if (!entity) return null;

    const { id, fileId, version } = entity;

    return {
      _id: id.value,
      fileId: fileId.value,
      __version: version,
    };
  }

  toDomain(dbModel: DbDocument): Document {
    if (!dbModel) return null;

    const { _id, fileId, __version } = dbModel;

    return new Document(
      {
        fileId: new FileId(fileId),
      },
      __version,
      new DocumentId(_id)
    );
  }
}
