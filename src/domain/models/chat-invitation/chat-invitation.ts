import { AggregateRoot, EntityId } from "@libs/ddd";
import { UserId } from "../user/user";
import { ChatId } from "../chat/chat";
import { ChatInvitationCreatedDomainEvent } from "./events/chat-invitation-created";
import { ChatInvitationAcceptedDomainEvent } from "./events/chat-invitation-accepted";
import { ChatInvitationDeclinedDomainEvent } from "./events/chat-invitation-declined";

export enum ChatInvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
}

export enum ChatInvitationResponse {
  ACCEPT = "accept",
  DECLINE = "decline",
}

export interface IChatInvitationProps {
  inviterUserId: UserId;
  invitedUserId: UserId;
  chatId: ChatId;
  expiredAt: Date;
  response: ChatInvitationResponse;
}

export class ChatInvitationId extends EntityId {}

export class ChatInvitation extends AggregateRoot<
  ChatInvitationId,
  IChatInvitationProps
> {
  private _inviterUserId: UserId;
  private _invitedUserId: UserId;
  private _chatId: ChatId;
  private _expiredAt: Date;
  private _response: ChatInvitationResponse;

  constructor(
    props: IChatInvitationProps,
    version: number,
    id?: ChatInvitationId
  ) {
    super(props, version, id);
  }

  get IdConstructor() {
    return ChatInvitationId;
  }

  protected init() {
    this._inviterUserId = this.props.inviterUserId;
    this._invitedUserId = this.props.invitedUserId;
    this._chatId = this.props.chatId;
    this._expiredAt = this.props.expiredAt;
    this._response = this.props.response;
  }

  protected validateProps() {}

  validate() {}

  static create(props: IChatInvitationProps) {
    const newInvitation = new ChatInvitation(props, 0);

    newInvitation.addEvent(
      new ChatInvitationCreatedDomainEvent({
        aggregateId: newInvitation.id,
        invitationId: newInvitation.id,
        chatId: newInvitation.chatId,
        inviterUserId: newInvitation.inviterUserId,
        invitedUserId: newInvitation.invitedUserId,
        expiredAt: newInvitation.expiredAt,
      })
    );

    return newInvitation;
  }

  get inviterUserId() {
    return this._inviterUserId;
  }

  get invitedUserId() {
    return this._invitedUserId;
  }

  get chatId() {
    return this._chatId;
  }

  get expiredAt() {
    return this._expiredAt;
  }

  get response() {
    return this._response;
  }

  status(): ChatInvitationStatus {
    const now = new Date();

    if (now.getTime() >= this.expiredAt.getTime())
      return ChatInvitationStatus.EXPIRED;

    if (this.response === ChatInvitationResponse.ACCEPT)
      return ChatInvitationStatus.ACCEPTED;

    if (this.response === ChatInvitationResponse.DECLINE)
      return ChatInvitationStatus.DECLINED;

    return ChatInvitationStatus.PENDING;
  }

  isPending() {
    return this.status() === ChatInvitationStatus.PENDING;
  }

  isAccepted() {
    return this.status() === ChatInvitationStatus.ACCEPTED;
  }

  isDeclined() {
    return this.status() === ChatInvitationStatus.DECLINED;
  }

  isExpired() {
    return this.status() === ChatInvitationStatus.EXPIRED;
  }

  updateResponse(response: ChatInvitationResponse) {
    if (!this.isPending()) return;

    this.update(() => {
      this._response = response;
    });

    if (this.isAccepted())
      this.addEvent(
        new ChatInvitationAcceptedDomainEvent({
          aggregateId: this.id,
          invitationId: this.id,
        })
      );

    if (this.isDeclined())
      this.addEvent(
        new ChatInvitationDeclinedDomainEvent({
          aggregateId: this.id,
          invitationId: this.id,
        })
      );
  }
}
