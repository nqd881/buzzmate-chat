import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { ChatInvitationId } from "../chat-invitation";

export class ChatInvitationAcceptedDomainEvent extends DomainEvent<ChatInvitationAcceptedDomainEvent> {
  public readonly invitationId: ChatInvitationId;

  constructor(props: DomainEventProps<ChatInvitationAcceptedDomainEvent>) {
    super(props);

    this.invitationId = props.invitationId;
  }
}
