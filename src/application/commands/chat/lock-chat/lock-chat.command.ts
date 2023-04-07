import { Command, CommandProps } from "@libs/ddd";

export class LockChatCommand extends Command {
  public readonly chatId: string;

  constructor(props: CommandProps<LockChatCommand>) {
    super(props);

    this.chatId = props.chatId;
  }
}
