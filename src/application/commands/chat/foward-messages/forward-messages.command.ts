import {Command, CommandProps} from "@libs/ddd";

export class ForwardMessagesCommand extends Command {
  public readonly fromChatId: string;
  public readonly toChatId: string;
  public readonly messageIds: string[];

  constructor(props: CommandProps<ForwardMessagesCommand>) {
    super(props);

    this.fromChatId = props.fromChatId;
    this.toChatId = props.toChatId;
    this.messageIds = props.messageIds;
  }
}
