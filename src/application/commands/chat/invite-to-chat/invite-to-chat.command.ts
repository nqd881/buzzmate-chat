import { Command, CommandProps } from "@libs/ddd";

export class InviteToChatCommand extends Command {
  public readonly chatId: string;
  public readonly invitedUserIds: string[];

  constructor(props: CommandProps<InviteToChatCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.invitedUserIds = props.invitedUserIds;
  }
}
