import { ValueObject, ValueObjectProps } from "@libs/ddd";

export type MessageContentProps<T> = ValueObjectProps<T>;

export abstract class MessageContent<T> extends ValueObject<T> {
  constructor(props: MessageContentProps<T>) {
    super(props);
  }
}
