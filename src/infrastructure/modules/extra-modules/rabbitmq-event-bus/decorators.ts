import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

export type PickConfig<T> = T extends (config: infer C) => any ? C : never;

export const RabbitMQEventBusSubscribe = (
  config: Omit<PickConfig<typeof RabbitSubscribe>, "exchange">
) => RabbitSubscribe({...config, exchange: "BuzzmateEventBus"});
