import {ValueObject, ValueObjectProps} from "@libs/ddd";

export enum UserScopes {
  EVERYBODY = "everybody",
  NOBODY = "nobody",
}

export interface IUserPrivacyProps {
  canBeAddedBy: UserScopes;
}

export class UserPrivacy extends ValueObject<IUserPrivacyProps> {
  constructor(props: ValueObjectProps<IUserPrivacyProps>) {
    super(props);
  }

  protected validate() {}

  get canBeAddedBy() {
    return this.props.canBeAddedBy;
  }
}
