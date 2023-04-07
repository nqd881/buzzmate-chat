import {ChatId} from "@domain/models/chat/chat";
import {MessageId} from "@domain/models/message/message";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class MessagePinnedDomainEvent extends DomainEvent<MessagePinnedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly messageId: MessageId;

  constructor(props: DomainEventProps<MessagePinnedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.messageId = props.messageId;
  }
}
