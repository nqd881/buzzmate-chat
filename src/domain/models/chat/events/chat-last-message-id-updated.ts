import {ChatId} from "@domain/models/chat/chat";
import {MessageId} from "@domain/models/message/message";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatLastMessageIdUpdatedDomainEvent extends DomainEvent<ChatLastMessageIdUpdatedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly lastMessageId: MessageId;

  constructor(props: DomainEventProps<ChatLastMessageIdUpdatedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.lastMessageId = props.lastMessageId;
  }
}
