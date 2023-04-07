import { Command, CommandProps } from "@libs/ddd";

export class BanMembersCommand extends Command {
  public readonly chatId: string;
  public readonly memberIds: string[];
  public readonly reason?: string;

  constructor(props: CommandProps<BanMembersCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.memberIds = props.memberIds;
    this.reason = props?.reason;
  }
}
