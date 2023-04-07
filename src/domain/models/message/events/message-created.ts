import {ChatId} from "@domain/models/chat/chat";
import {MessageId} from "@domain/models/message/message";
import {MessageForwardInfo} from "@domain/models/message/message-forward-info";
import {UserId} from "@domain/models/user/user";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class MessageCreatedDomainEvent extends DomainEvent<MessageCreatedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly messageId: MessageId;
  public readonly replyToMessageId: MessageId;
  public readonly senderUserId: UserId;
  public readonly contentType: string;
  public readonly forwardInfo: MessageForwardInfo;

  constructor(props: DomainEventProps<MessageCreatedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.messageId = props.messageId;
    this.replyToMessageId = props.replyToMessageId;
    this.senderUserId = props.senderUserId;
    this.contentType = props.contentType;
    this.forwardInfo = props.forwardInfo;
  }
}
