import {Command, CommandProps} from "@libs/ddd";

export class SendReactionCommand extends Command {
  public readonly chatId: string;
  public readonly messageId: string;
  public readonly reactionValue: string;

  constructor(props: CommandProps<SendReactionCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.messageId = props.messageId;
    this.reactionValue = props.reactionValue;
  }
}
