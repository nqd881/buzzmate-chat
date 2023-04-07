import {ChatOwnerId} from "@domain/models/chat-owner/chat-owner";
import {UserId} from "@domain/models/user/user";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatOwnerCreatedDomainEvent extends DomainEvent<ChatOwnerCreatedDomainEvent> {
  public readonly userId: UserId;
  public readonly chatOwnerId: ChatOwnerId;

  constructor(props: DomainEventProps<ChatOwnerCreatedDomainEvent>) {
    super(props);

    this.userId = props.userId;
    this.chatOwnerId = props.chatOwnerId;
  }
}
