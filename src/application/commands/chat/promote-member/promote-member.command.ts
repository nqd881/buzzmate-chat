import {Command, CommandProps} from "@libs/ddd";

export class PromoteMemberCommand extends Command {
  public readonly chatId: string;
  public readonly memberId: string;

  constructor(props: CommandProps<PromoteMemberCommand>) {
    super(props);

    this.chatId = props.chatId;
    this.memberId = props.memberId;
  }
}
