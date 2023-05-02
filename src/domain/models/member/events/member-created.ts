import { ChatId } from "@domain/models/chat/chat";
import { MemberId } from "@domain/models/member/member";
import { UserId } from "@domain/models/user/user";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class MemberCreatedDomainEvent extends DomainEvent<MemberCreatedDomainEvent> {
  public readonly memberId: MemberId;
  public readonly chatId: ChatId;
  public readonly userId: UserId;
  public readonly name: string;

  constructor(props: DomainEventProps<MemberCreatedDomainEvent>) {
    super(props);

    this.memberId = props.memberId;
    this.chatId = props.chatId;
    this.userId = props.userId;
    this.name = props.name;
  }
}
