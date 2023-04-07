import _ from "lodash";
import {Guard} from "./guard";

export type Primitives = string | number | boolean;

export interface DomainPrimitive<T extends Primitives | Date> {
  __value: T;
}

export type ValueObjectProps<T> = T extends Primitives | Date
  ? DomainPrimitive<T>
  : T;

export interface ValueObjectType<T> {
  new (props: ValueObjectProps<T>): ValueObject<T>;
}

export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
    // this.checkIfEmpty(props);
    this.validate(props);

    this.props = props;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }

  // private checkIfEmpty(props: ValueObjectProps<T>): void {
  //   if (
  //     Guard.isEmpty(props) ||
  //     (this.isDomainPrimitive(props) && Guard.isEmpty(props.__value))
  //   ) {
  //     throw new Error("Property cannot be empty");
  //   }
  // }

  // private isDomainPrimitive(
  //   obj: unknown
  // ): obj is DomainPrimitive<T & (Primitives | Date)> {
  //   if (Object.prototype.hasOwnProperty.call(obj, "__value")) {
  //     return true;
  //   }
  //   return false;
  // }

  cloneWith(props: Partial<ValueObjectProps<T>>) {
    const copyThisProps = Object.assign({}, this.props);

    return new (this.constructor as ValueObjectType<T>)(
      _.merge(copyThisProps, props)
    ) as typeof this;
  }

  clone() {
    return this.cloneWith(null);
  }
}
