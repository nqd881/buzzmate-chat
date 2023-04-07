import {DOMAIN_EVENT_BUS} from "@application/di-tokens/domain-event-bus";
import {Global, Module} from "@nestjs/common";
import EventEmitter2 from "eventemitter2";
import {DomainEventBusService} from "./domain-event-bus.service";

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: DOMAIN_EVENT_BUS,
      useExisting: EventEmitter2,
    },
    DomainEventBusService,
  ],
  exports: [DOMAIN_EVENT_BUS, DomainEventBusService],
})
export class DomainEventBusModule {}
