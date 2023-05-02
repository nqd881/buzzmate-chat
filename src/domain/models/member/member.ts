import { AggregateRoot, EntityId } from "@libs/ddd";
import { ChatId } from "../chat/chat";
import { UserId } from "../user/user";
import { MemberStatusActive } from "./member-status/member-status-active";
import { MemberStatusBanned } from "./member-status/member-status-banned";
import { MemberStatusLeft } from "./member-status/member-status-left";
import { MemberStatus } from "./member-status";
import { MemberCreatedDomainEvent } from "./events/member-created";
import { MemberStatusChangedDomainEvent } from "./events/member-status-changed";

export interface IMemberProps {
  chatId: ChatId;
  userId: UserId;
  name: string;
  nickname: string;
  inviterUserId: UserId;
  joinedDate: Date;
  status: MemberStatus<any>;
}

export class MemberId extends EntityId {}

export class Member extends AggregateRoot<MemberId, IMemberProps> {
  protected _chatId: ChatId;
  protected _userId: UserId;
  protected _name: string;
  protected _nickname: string;
  protected _inviterUserId: UserId;
  protected _joinedDate: Date;
  protected _status: MemberStatus<any>;

  constructor(props: IMemberProps, version: number, id?: MemberId) {
    super(props, version, id);
  }

  protected get IdConstructor() {
    return MemberId;
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

  static create(props: IMemberProps) {
    const newMember = new Member(props, 0);

    newMember.addEvent(
      new MemberCreatedDomainEvent({
        aggregateId: newMember.id,
        memberId: newMember.id,
        chatId: newMember.chatId,
        userId: newMember.userId,
        name: newMember.name,
      })
    );

    return newMember;
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
    return this.status.type === MemberStatusActive.name;
  }

  isBanned() {
    return this.status.type === MemberStatusBanned.name;
  }

  hasLeft() {
    return this.status.type === MemberStatusLeft.name;
  }

  changeStatus(status: MemberStatus<any>) {
    if (!this.isActive()) return;

    if (this.status.equals(status)) return;

    this.update(() => {
      this._status = status;
    });

    this.addEvent(
      new MemberStatusChangedDomainEvent({
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
