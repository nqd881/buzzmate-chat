import { Command, CommandProps } from "@libs/ddd";

export interface InputFile {
  name: string;
  mimetype: string;
  size: number;
  content: Buffer;
}

export class SendMessageCommand extends Command {
  public readonly prepareMessageId?: string;
  public readonly chatId: string;
  public readonly message?: string;
  public readonly replyToMessageId?: string;
  public readonly file?: InputFile;

  constructor(props: CommandProps<SendMessageCommand>) {
    super(props);

    this.prepareMessageId = props?.prepareMessageId;
    this.chatId = props.chatId;
    this.message = props.message;
    this.replyToMessageId = props.replyToMessageId;
    this.file = props?.file;
  }
}
