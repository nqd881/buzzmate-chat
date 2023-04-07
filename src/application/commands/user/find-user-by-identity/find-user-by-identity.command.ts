import {Command, CommandProps} from "@libs/ddd";

export class FindUserByIdentityCommand extends Command {
  public readonly identity: string;

  constructor(props: CommandProps<FindUserByIdentityCommand>) {
    super(props);

    this.identity = props.identity;
  }
}
