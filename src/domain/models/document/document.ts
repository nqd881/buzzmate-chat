import {AggregateRoot, EntityId} from "@libs/ddd";
import {ChatId} from "../chat/chat";
import {FileId} from "../file/file";
import {DocumentCreatedDomainEvent} from "./events/document-created";

export interface IDocumentProps {
  chatId: ChatId;
  fileId: FileId;
}

export class DocumentId extends EntityId {}

export class Document extends AggregateRoot<DocumentId, IDocumentProps> {
  protected _chatId: ChatId;
  protected _fileId: FileId;

  constructor(props: IDocumentProps, version: number, id?: DocumentId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return DocumentId;
  }

  protected init() {
    this._chatId = this.props.chatId;
    this._fileId = this.props.fileId;
  }

  validateProps() {}

  validate() {}

  static create(props: IDocumentProps) {
    const newDocument = new Document(props, 0);

    newDocument.addEvent(
      new DocumentCreatedDomainEvent({
        aggregateId: newDocument.id,
        chatId: newDocument.chatId,
        documentId: newDocument.id,
      })
    );

    return newDocument;
  }

  get chatId() {
    return this._chatId;
  }

  get fileId() {
    return this._fileId;
  }
}
