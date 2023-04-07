import {UserTypes} from "@domain/models/user/user";
import {Command, CommandProps} from "@libs/ddd";

export class CreateUserCommand extends Command {
  public readonly identity: string;
  public readonly name: string;
  public readonly emailAddress: string;
  public readonly type: UserTypes;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);

    this.identity = props.identity;
    this.name = props.name;
    this.emailAddress = props.emailAddress;
    this.type = props.type;
  }
}
