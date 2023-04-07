import { Command, CommandProps } from "@libs/ddd";

export class JoinChatCommand extends Command {
  public readonly chatId: string;
  public readonly key?: string;

  constructor(props: CommandProps<JoinChatCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.key = props?.key;
  }
}
