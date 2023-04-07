import {ChatId} from "@domain/models/chat/chat";
import {ChatMemberId} from "@domain/models/chat-member/chat-member";
import {UserId} from "@domain/models/user/user";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatMemberCreatedDomainEvent extends DomainEvent<ChatMemberCreatedDomainEvent> {
  public readonly memberId: ChatMemberId;
  public readonly chatId: ChatId;
  public readonly userId: UserId;
  public readonly name: string;

  constructor(props: DomainEventProps<ChatMemberCreatedDomainEvent>) {
    super(props);

    this.memberId = props.memberId;
    this.chatId = props.chatId;
    this.userId = props.userId;
    this.name = props.name;
  }
}
