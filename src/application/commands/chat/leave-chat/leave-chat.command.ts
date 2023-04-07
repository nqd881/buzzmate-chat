import {Command, CommandProps} from "@libs/ddd";

export class LeaveChatCommand extends Command {
  public readonly chatId: string;

  constructor(props: CommandProps<LeaveChatCommand>) {
    super(props);

    this.chatId = props.chatId;
  }
}
