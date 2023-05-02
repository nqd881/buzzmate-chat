import { MemberId } from "@domain/models/member/member";
import { MessageId } from "@domain/models/message/message";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class MessageReactionsOfMemberClearedDomainEvent extends DomainEvent<MessageReactionsOfMemberClearedDomainEvent> {
  public readonly messageId: MessageId;
  public readonly memberId: MemberId;

  constructor(
    props: DomainEventProps<MessageReactionsOfMemberClearedDomainEvent>
  ) {
    super(props);

    this.messageId = props.messageId;
    this.memberId = props.memberId;
  }
}
