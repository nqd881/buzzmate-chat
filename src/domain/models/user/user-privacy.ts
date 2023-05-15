import { ValueObject } from "@libs/ddd";

export enum UserScopes {
  EVERYBODY = "everybody",
  NOBODY = "nobody",
}

export interface IUserPrivacyProps {
  canBeAddedBy: UserScopes;
}

export class UserPrivacy extends ValueObject<IUserPrivacyProps> {
  constructor(props: IUserPrivacyProps) {
    super(props);
  }

  protected validate() {}

  get canBeAddedBy() {
    return this.props.canBeAddedBy;
  }
}
