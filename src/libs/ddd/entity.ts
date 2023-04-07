import {EntityId, EntityIdType} from "./entity-id";

export abstract class Entity<T extends EntityId, Props = unknown> {
  protected _id: T;
  protected props: Props;

  constructor(props: Props, id?: T) {
    this.validateProps(props);
    this.props = props;
    this.setId(id);
    this.init();
    this.validate();
  }

  static isEntity(obj: unknown): obj is Entity<any, unknown> {
    return obj instanceof Entity;
  }

  protected abstract get IdConstructor(): EntityIdType<T>;

  protected abstract init(): void;

  protected abstract validateProps(props: Props): void;

  public abstract validate(): void;

  private setId(id?: T) {
    this._id = id ?? new this.IdConstructor();
  }

  get id() {
    return this._id;
  }

  equals(other: Entity<T, Props>): boolean {
    if (other == null || other == undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    if (!Entity.isEntity(other)) {
      return false;
    }

    if (this.constructor.name !== other.constructor.name) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
