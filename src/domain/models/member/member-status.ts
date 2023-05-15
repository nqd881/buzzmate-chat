import { ValueObject } from "@libs/ddd";

export abstract class MemberStatus<T> extends ValueObject<T> {
  protected constructor(props: T) {
    super(props);
  }

  get type() {
    return this.constructor.name;
  }
}
