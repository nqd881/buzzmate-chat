import {UserId, UserTypes} from "@domain/models/user/user";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class UserCreatedDomainEvent extends DomainEvent<UserCreatedDomainEvent> {
  public readonly userId: UserId;
  public readonly identity: string;
  public readonly name: string;
  public readonly emailAddress: string;
  public readonly type: UserTypes;

  constructor(props: DomainEventProps<UserCreatedDomainEvent>) {
    super(props);

    this.userId = props.userId;
    this.identity = props.identity;
    this.name = props.name;
    this.emailAddress = props.emailAddress;
    this.type = props.type;
  }
}
