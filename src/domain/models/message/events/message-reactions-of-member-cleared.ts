import {ChatMemberId} from "@domain/models/chat-member/chat-member";
import {MessageId} from "@domain/models/message/message";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class MessageReactionsOfMemberClearedDomainEvent extends DomainEvent<MessageReactionsOfMemberClearedDomainEvent> {
  public readonly messageId: MessageId;
  public readonly chatMemberId: ChatMemberId;

  constructor(
    props: DomainEventProps<MessageReactionsOfMemberClearedDomainEvent>
  ) {
    super(props);

    this.messageId = props.messageId;
    this.chatMemberId = props.chatMemberId;
  }
}
