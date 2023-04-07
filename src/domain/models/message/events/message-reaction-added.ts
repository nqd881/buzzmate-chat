import {ChatMemberId} from "@domain/models/chat-member/chat-member";
import {ChatId} from "@domain/models/chat/chat";
import {MessageId} from "@domain/models/message/message";
import {MessageReactionValue} from "@domain/models/message/message-reaction";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class MessageReactionAddedDomainEvent extends DomainEvent<MessageReactionAddedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly messageId: MessageId;
  public readonly chatMemberId: ChatMemberId;
  public readonly reactionValue: MessageReactionValue;

  constructor(props: DomainEventProps<MessageReactionAddedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.messageId = props.messageId;
    this.chatMemberId = props.chatMemberId;
    this.reactionValue = props.reactionValue;
  }
}
