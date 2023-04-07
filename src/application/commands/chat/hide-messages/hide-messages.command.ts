import {Command, CommandProps} from "@libs/ddd";

export class HideMessagesCommand extends Command {
  public readonly chatId: string;
  public readonly messageIds: string[];

  constructor(props: CommandProps<HideMessagesCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.messageIds = props.messageIds;
  }
}
