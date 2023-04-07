import {Chat, ChatId} from "@domain/models/chat/chat";
import {ChatMemberId} from "@domain/models/chat-member/chat-member";
import {UserId} from "@domain/models/user/user";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatMemberDisabledDomainEvent extends DomainEvent<ChatMemberDisabledDomainEvent> {
  public readonly chatId: ChatId;
  public readonly memberId: ChatMemberId;
  public readonly userId: UserId;

  constructor(props: DomainEventProps<ChatMemberDisabledDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.memberId = props.memberId;
    this.userId = props.userId;
  }
}
