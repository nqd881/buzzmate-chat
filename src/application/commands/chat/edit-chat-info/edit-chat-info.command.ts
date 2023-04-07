import {Command, CommandProps} from "@libs/ddd";

export class EditChatInfoCommand extends Command {
  public readonly chatId: string;
  public readonly title?: string;
  public readonly description?: string;

  constructor(props: CommandProps<EditChatInfoCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.title = props?.title;
    this.description = props?.description;
  }
}
