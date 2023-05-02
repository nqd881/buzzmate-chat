import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { InvitationId } from "../invitation";

export class InvitationDeclinedDomainEvent extends DomainEvent<InvitationDeclinedDomainEvent> {
  public readonly invitationId: InvitationId;

  constructor(props: DomainEventProps<InvitationDeclinedDomainEvent>) {
    super(props);

    this.invitationId = props.invitationId;
  }
}
