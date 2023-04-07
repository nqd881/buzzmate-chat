import {ChatId} from "@domain/models/chat/chat";
import {UserId} from "@domain/models/user/user";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatAdminCreatedDomainEvent extends DomainEvent<ChatAdminCreatedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly userId: UserId;

  constructor(props: DomainEventProps<ChatAdminCreatedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.userId = props.userId;
  }
}
