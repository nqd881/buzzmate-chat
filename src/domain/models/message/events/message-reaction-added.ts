import { ChatId } from "@domain/models/chat/chat";
import { MemberId } from "@domain/models/member/member";
import { MessageId } from "@domain/models/message/message";
import { MessageReactionValue } from "@domain/models/message/message-reaction";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class MessageReactionAddedDomainEvent extends DomainEvent<MessageReactionAddedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly messageId: MessageId;
  public readonly memberId: MemberId;
  public readonly reactionValue: MessageReactionValue;

  constructor(props: DomainEventProps<MessageReactionAddedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.messageId = props.messageId;
    this.memberId = props.memberId;
    this.reactionValue = props.reactionValue;
  }
}
