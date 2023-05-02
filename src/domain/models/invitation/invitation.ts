import { AggregateRoot, EntityId } from "@libs/ddd";
import { UserId } from "../user/user";
import { ChatId } from "../chat/chat";
import { InvitationCreatedDomainEvent } from "./events/invitation-created";
import { InvitationAcceptedDomainEvent } from "./events/invitation-accepted";
import { InvitationDeclinedDomainEvent } from "./events/invitation-declined";

export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
}

export enum InvitationResponse {
  ACCEPT = "accept",
  DECLINE = "decline",
}

export interface IInvitationProps {
  inviterUserId: UserId;
  invitedUserId: UserId;
  chatId: ChatId;
  expiredAt: Date;
  response: InvitationResponse;
}

export class InvitationId extends EntityId {}

export class Invitation extends AggregateRoot<InvitationId, IInvitationProps> {
  private _inviterUserId: UserId;
  private _invitedUserId: UserId;
  private _chatId: ChatId;
  private _expiredAt: Date;
  private _response: InvitationResponse;

  constructor(props: IInvitationProps, version: number, id?: InvitationId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return InvitationId;
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

  static create(props: IInvitationProps) {
    const newInvitation = new Invitation(props, 0);

    newInvitation.addEvent(
      new InvitationCreatedDomainEvent({
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

  status(): InvitationStatus {
    const now = new Date();

    if (now.getTime() >= this.expiredAt.getTime())
      return InvitationStatus.EXPIRED;

    if (this.response === InvitationResponse.ACCEPT)
      return InvitationStatus.ACCEPTED;

    if (this.response === InvitationResponse.DECLINE)
      return InvitationStatus.DECLINED;

    return InvitationStatus.PENDING;
  }

  isPending() {
    return this.status() === InvitationStatus.PENDING;
  }

  isAccepted() {
    return this.status() === InvitationStatus.ACCEPTED;
  }

  isDeclined() {
    return this.status() === InvitationStatus.DECLINED;
  }

  isExpired() {
    return this.status() === InvitationStatus.EXPIRED;
  }

  updateResponse(response: InvitationResponse) {
    if (!this.isPending()) return;

    this.update(() => {
      this._response = response;
    });

    if (this.isAccepted())
      this.addEvent(
        new InvitationAcceptedDomainEvent({
          aggregateId: this.id,
          invitationId: this.id,
        })
      );

    if (this.isDeclined())
      this.addEvent(
        new InvitationDeclinedDomainEvent({
          aggregateId: this.id,
          invitationId: this.id,
        })
      );
  }
}
