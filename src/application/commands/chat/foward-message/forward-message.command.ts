import { Command, CommandProps } from "@libs/ddd";

export class ForwardMessageCommand extends Command {
  public readonly fromChatId: string;
  public readonly toChatId: string;
  public readonly messageId: string;

  constructor(props: CommandProps<ForwardMessageCommand>) {
    super(props);

    this.fromChatId = props.fromChatId;
    this.toChatId = props.toChatId;
    this.messageId = props.messageId;
  }
}
