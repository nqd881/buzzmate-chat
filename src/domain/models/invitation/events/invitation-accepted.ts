import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { InvitationId } from "../invitation";

export class InvitationAcceptedDomainEvent extends DomainEvent<InvitationAcceptedDomainEvent> {
  public readonly invitationId: InvitationId;

  constructor(props: DomainEventProps<InvitationAcceptedDomainEvent>) {
    super(props);

    this.invitationId = props.invitationId;
  }
}
