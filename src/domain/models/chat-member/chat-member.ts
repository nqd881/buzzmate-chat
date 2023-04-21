import { AggregateRoot, EntityId } from "@libs/ddd";
import { ChatId } from "../chat/chat";
import { UserId } from "../user/user";
import { ChatMemberStatus } from "./chat-member-status";
import { ChatMemberStatusActive } from "./chat-member-status/chat-member-status-active";
import { ChatMemberStatusBanned } from "./chat-member-status/chat-member-status-banned";
import { ChatMemberStatusLeft } from "./chat-member-status/chat-member-status-left";
import { ChatMemberCreatedDomainEvent } from "./events/chat-member-created";
import { ChatMemberStatusChangedDomainEvent } from "./events/chat-member-status-changed";

export interface IChatMemberProps {
  chatId: ChatId;
  userId: UserId;
  name: string;
  nickname: string;
  inviterUserId: UserId;
  joinedDate: Date;
  status: ChatMemberStatus<any>;
}

export class ChatMemberId extends EntityId {}

export class ChatMember extends AggregateRoot<ChatMemberId, IChatMemberProps> {
  protected _chatId: ChatId;
  protected _userId: UserId;
  protected _name: string;
  protected _nickname: string;
  protected _inviterUserId: UserId;
  protected _joinedDate: Date;
  protected _status: ChatMemberStatus<any>;

  constructor(props: IChatMemberProps, version: number, id?: ChatMemberId) {
    super(props, version, id);
  }

  protected get IdConstructor() {
    return ChatMemberId;
  }

  protected init() {
    this._chatId = this.props.chatId;
    this._userId = this.props.userId;
    this._name = this.props.name;
    this._nickname = this.props.nickname;
    this._inviterUserId = this.props.inviterUserId;
    this._joinedDate = this.props.joinedDate;
    this._status = this.props.status;
  }

  protected validateProps() {}

  validate() {}

  static create(props: IChatMemberProps) {
    const newChatMember = new ChatMember(props, 0);

    newChatMember.addEvent(
      new ChatMemberCreatedDomainEvent({
        aggregateId: newChatMember.id,
        memberId: newChatMember.id,
        chatId: newChatMember.chatId,
        userId: newChatMember.userId,
        name: newChatMember.name,
      })
    );

    return newChatMember;
  }

  get chatId() {
    return this._chatId;
  }

  get userId() {
    return this._userId;
  }

  get name() {
    return this._name;
  }

  get nickname() {
    return this._nickname;
  }

  get inviterUserId() {
    return this._inviterUserId;
  }

  get joinedDate() {
    return this._joinedDate;
  }

  get status() {
    return this._status;
  }

  isActive() {
    return this.status.type === ChatMemberStatusActive.name;
  }

  isBanned() {
    return this.status.type === ChatMemberStatusBanned.name;
  }

  hasLeft() {
    return this.status.type === ChatMemberStatusLeft.name;
  }

  changeStatus(status: ChatMemberStatus<any>) {
    if (!this.isActive()) return;

    if (this.status.equals(status)) return;

    this.update(() => {
      this._status = status;
    });

    this.addEvent(
      new ChatMemberStatusChangedDomainEvent({
        aggregateId: this.id,
        memberId: this.id,
        chatId: this.chatId,
        userId: this.userId,
        status: this.status,
      })
    );
  }

  changeNickname(nickname: string) {
    this.update(() => {
      this._nickname = nickname;
    });
  }
}
