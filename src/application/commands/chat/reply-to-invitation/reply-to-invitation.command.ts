import { Command, CommandProps } from "@libs/ddd";

export class ReplyToInvitationCommand extends Command {
  public readonly invitationId: string;
  public readonly accept: boolean;

  constructor(props: CommandProps<ReplyToInvitationCommand>) {
    super(props);

    this.invitationId = props.invitationId;
    this.accept = props.accept;
  }
}
