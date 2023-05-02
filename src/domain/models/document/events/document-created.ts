import { DocumentId } from "@domain/models/document/document";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class DocumentCreatedDomainEvent extends DomainEvent<DocumentCreatedDomainEvent> {
  public readonly documentId: DocumentId;

  constructor(props: DomainEventProps<DocumentCreatedDomainEvent>) {
    super(props);

    this.documentId = props.documentId;
  }
}
