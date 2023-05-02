import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { InvitationId } from "../invitation";

export class InvitationCreatedDomainEvent extends DomainEvent<InvitationCreatedDomainEvent> {
  public readonly invitationId: InvitationId;
  public readonly chatId: ChatId;
  public readonly inviterUserId: UserId;
  public readonly invitedUserId: UserId;
  public readonly expiredAt: Date;

  constructor(props: DomainEventProps<InvitationCreatedDomainEvent>) {
    super(props);

    this.invitationId = props.invitationId;
    this.chatId = props.chatId;
    this.inviterUserId = props.inviterUserId;
    this.invitedUserId = props.invitedUserId;
    this.expiredAt = props.expiredAt;
  }
}
