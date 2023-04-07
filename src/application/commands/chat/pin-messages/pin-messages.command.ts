import {Command, CommandProps} from "@libs/ddd";

export class PinMessagesCommand extends Command {
  public readonly chatId: string;
  public readonly messageIds: string[];
  public readonly shouldPin: boolean;

  constructor(props: CommandProps<PinMessagesCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.messageIds = props.messageIds;
    this.shouldPin = props.shouldPin;
  }
}
