import {ChatId} from "@domain/models/chat/chat";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatLockedDomainEvent extends DomainEvent<ChatLockedDomainEvent> {
  public readonly chatId: ChatId;

  constructor(props: DomainEventProps<ChatLockedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
  }
}
