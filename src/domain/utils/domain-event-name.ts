import {DomainEvent} from "@libs/ddd";

export type DomainEventClass<T extends DomainEvent<T>> = new (
  ...args: any[]
) => DomainEvent<T>;

export const DomainEventName = <T extends DomainEvent<T>>(
  eventClass: DomainEventClass<T>
) => {
  return `DomainEvent.${eventClass.name}`;
};
