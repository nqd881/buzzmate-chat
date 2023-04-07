import {ChatId} from "@domain/models/chat/chat";
import {DocumentId} from "@domain/models/document/document";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class DocumentCreatedDomainEvent extends DomainEvent<DocumentCreatedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly documentId: DocumentId;

  constructor(props: DomainEventProps<DocumentCreatedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.documentId = props.documentId;
  }
}
