import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {
  DomainEventClass,
  DomainEventName,
} from "@domain/utils/domain-event-name";
import {DomainEvent} from "@libs/ddd";
import {MaybePromise} from "@libs/utilities/types";
import {Inject, Injectable} from "@nestjs/common";
import EventEmitter2 from "eventemitter2";

export type DynamicDomainEventHandler<T extends DomainEvent<T>> = (
  event: T,
  destroyFn: () => void
) => MaybePromise<void | any>;

@Injectable()
export class DomainEventBusService {
  constructor(
    @Inject(DOMAIN_EVENT_BUS) private readonly domainEventBus: EventEmitter2
  ) {}

  registerDynamicHandler<T extends DomainEvent<T>>(
    eventClass: DomainEventClass<T>,
    handler: DynamicDomainEventHandler<T>
  ) {
    const eventName = DomainEventName(eventClass);

    const wrappedHandler = async (event: T) => {
      const destroyFn = () => {
        this.domainEventBus.removeListener(eventName, wrappedHandler);
      };

      await Promise.resolve(handler(event, destroyFn));
    };

    this.domainEventBus.on(eventName, wrappedHandler);
  }
}
