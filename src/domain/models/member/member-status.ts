import { ValueObject, ValueObjectProps } from "@libs/ddd";

export type MemberStatusProps<T> = ValueObjectProps<T>;

export abstract class MemberStatus<T> extends ValueObject<T> {
  constructor(props: MemberStatusProps<T>) {
    super(props);
  }

  get type() {
    return this.constructor.name;
  }
}
