import { ChatId } from "@domain/models/chat/chat";
import { MemberId } from "@domain/models/member/member";
import { UserId } from "@domain/models/user/user";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class MemberDisabledDomainEvent extends DomainEvent<MemberDisabledDomainEvent> {
  public readonly chatId: ChatId;
  public readonly memberId: MemberId;
  public readonly userId: UserId;

  constructor(props: DomainEventProps<MemberDisabledDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.memberId = props.memberId;
    this.userId = props.userId;
  }
}
