import _ from "lodash";
import { IClonable } from "@domain/interfaces/clonable.interface";

export interface ValueObjectType<T> {
  new (props: T): ValueObject<T>;
}
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.validate(props);

    this.props = props;
  }

  protected abstract validate(props: T): void;

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }

  cloneWith(props: Partial<T>) {
    const copyThisProps = Object.assign({}, this.props);

    return new (this.constructor as ValueObjectType<T>)(
      _.merge(copyThisProps, props)
    ) as typeof this;
  }

  clone() {
    return this.cloneWith(null);
  }
}
