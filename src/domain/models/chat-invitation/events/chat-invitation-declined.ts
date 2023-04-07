import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { ChatInvitationId } from "../chat-invitation";

export class ChatInvitationDeclinedDomainEvent extends DomainEvent<ChatInvitationDeclinedDomainEvent> {
  public readonly invitationId: ChatInvitationId;

  constructor(props: DomainEventProps<ChatInvitationDeclinedDomainEvent>) {
    super(props);

    this.invitationId = props.invitationId;
  }
}
