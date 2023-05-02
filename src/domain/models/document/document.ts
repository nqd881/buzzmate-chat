import { AggregateRoot, EntityId } from "@libs/ddd";
import { FileId } from "../file/file";
import { DocumentCreatedDomainEvent } from "./events/document-created";

export interface IDocumentProps {
  fileId: FileId;
}

export class DocumentId extends EntityId {}

export class Document extends AggregateRoot<DocumentId, IDocumentProps> {
  protected _fileId: FileId;

  constructor(props: IDocumentProps, version: number, id?: DocumentId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return DocumentId;
  }

  protected init() {
    this._fileId = this.props.fileId;
  }

  validateProps() {}

  validate() {}

  static create(props: IDocumentProps) {
    const newDocument = new Document(props, 0);

    newDocument.addEvent(
      new DocumentCreatedDomainEvent({
        aggregateId: newDocument.id,
        documentId: newDocument.id,
      })
    );

    return newDocument;
  }

  get fileId() {
    return this._fileId;
  }
}
