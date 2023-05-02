import { ChatId } from "@domain/models/chat/chat";
import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { MemberId } from "../member";
import { MemberStatus } from "../member-status";

export class MemberStatusChangedDomainEvent extends DomainEvent<MemberStatusChangedDomainEvent> {
  public readonly memberId: MemberId;
  public readonly chatId: ChatId;
  public readonly userId: ChatId;
  public readonly status: MemberStatus<any>;

  constructor(props: DomainEventProps<MemberStatusChangedDomainEvent>) {
    super(props);

    this.memberId = props.memberId;
    this.chatId = props.chatId;
    this.userId = props.userId;
    this.status = props.status;
  }
}
