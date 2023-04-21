import {
  DomainEventClass,
  DomainEventName,
} from "@domain/utils/domain-event-name";
import EventEmitter2 from "eventemitter2";
import { DomainEvent } from "./domain-event";
import { Entity } from "./entity";
import { EntityId } from "./entity-id";

export type UpdateFn = () => void;

export abstract class AggregateRoot<
  Id extends EntityId,
  Props = unknown
> extends Entity<Id, Props> {
  private _isMarked: boolean = false;
  private _version: number;
  private _domainEvents: DomainEvent<any>[] = [];

  constructor(props: Props, version: number, id?: Id) {
    super(props, id);

    this._version = version;
  }

  get domainEvents(): DomainEvent<any>[] {
    return this._domainEvents;
  }

  get version() {
    if (this.isChanged()) return this._version + 1;

    return this._version;
  }

  get prevVersion() {
    return this.version - 1;
  }

  isNew() {
    return this._version === 0;
  }

  isChanged() {
    return this.domainEvents.length || this._isMarked;
  }

  mark() {
    this._isMarked = true;
  }

  unmark() {
    this._isMarked = false;
  }

  protected canUpdate() {
    return true;
  }

  protected update(updateFn: UpdateFn) {
    if (this.canUpdate()) {
      updateFn();

      this.mark();
    }
  }

  protected addEvent(domainEvent: DomainEvent<any>) {
    this._domainEvents.push(domainEvent);
  }

  protected clearEvents() {
    this._domainEvents = [];
  }

  async publishEvents(eventEmitter: EventEmitter2) {
    await Promise.all(
      this._domainEvents.map((event) =>
        eventEmitter.emitAsync(
          DomainEventName(event.constructor as DomainEventClass<any>),
          event
        )
      )
    );

    this.unmark();
    this.clearEvents();
  }
}
