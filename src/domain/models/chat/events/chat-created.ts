import {ChatId} from "@domain/models/chat/chat";
import {ChatOwnerId} from "@domain/models/chat-owner/chat-owner";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatCreatedDomainEvent extends DomainEvent<ChatCreatedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly title: string;
  public readonly ownerId: ChatOwnerId;

  constructor(props: DomainEventProps<ChatCreatedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.title = props.title;
    this.ownerId = props.ownerId;
  }
}
