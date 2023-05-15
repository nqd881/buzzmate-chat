import { File } from "@domain/models/file";
import { ValueObject } from "@libs/ddd";

export abstract class MessageContent<T> extends ValueObject<T> {
  protected constructor(props: T) {
    super(props);
  }

  abstract hasFile(): boolean;

  abstract getFile(): File;
}
