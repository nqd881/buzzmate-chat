import {ChatId} from "@domain/models/chat/chat";
import {Document, DocumentId} from "@domain/models/document/document";
import {FileId} from "@domain/models/file/file";
import {IDomainPersistenceMapper} from "@libs/ddd";
import {Injectable} from "@nestjs/common";
import {DbDocument} from "./document.schema";

@Injectable()
export class DocumentMapper
  implements IDomainPersistenceMapper<Document, DbDocument>
{
  toPersistence(entity: Document): DbDocument {
    if (!entity) return null;

    const {id, chatId, fileId, version} = entity;

    return {
      _id: id.value,
      chatId: chatId.value,
      fileId: fileId.value,
      __version: version,
    };
  }

  toDomain(dbModel: DbDocument): Document {
    if (!dbModel) return null;

    const {_id, chatId, fileId, __version} = dbModel;

    return new Document(
      {
        chatId: new ChatId(chatId),
        fileId: new FileId(fileId),
      },
      __version,
      new DocumentId(_id)
    );
  }
}
