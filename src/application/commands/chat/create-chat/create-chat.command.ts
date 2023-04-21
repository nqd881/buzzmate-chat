import { Command, CommandProps } from "@libs/ddd";

export class CreateChatCommand extends Command {
  public readonly title?: string;
  public readonly description?: string;
  public readonly memberUserIds: string[];
  public readonly accessKey?: string;

  constructor(props: CommandProps<CreateChatCommand>) {
    super(props);

    this.title = props.title;
    this.description = props.description;
    this.memberUserIds = props.memberUserIds;
    this.accessKey = props?.accessKey;
  }
}
