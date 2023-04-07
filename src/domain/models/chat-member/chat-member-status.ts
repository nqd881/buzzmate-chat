import {ValueObject, ValueObjectProps} from "@libs/ddd";

export type ChatMemberStatusProps<T> = ValueObjectProps<T>;

export abstract class ChatMemberStatus<T> extends ValueObject<T> {
  constructor(props: ChatMemberStatusProps<T>) {
    super(props);
  }

  get type() {
    return this.constructor.name;
  }
}
