import {ChatId} from "@domain/models/chat/chat";
import {DomainEvent, DomainEventProps} from "@libs/ddd";
import {ChatMemberId} from "../chat-member";
import {ChatMemberStatus} from "../chat-member-status";

export class ChatMemberStatusChangedDomainEvent extends DomainEvent<ChatMemberStatusChangedDomainEvent> {
  public readonly memberId: ChatMemberId;
  public readonly chatId: ChatId;
  public readonly userId: ChatId;
  public readonly status: ChatMemberStatus<any>;

  constructor(props: DomainEventProps<ChatMemberStatusChangedDomainEvent>) {
    super(props);

    this.memberId = props.memberId;
    this.chatId = props.chatId;
    this.userId = props.userId;
    this.status = props.status;
  }
}
