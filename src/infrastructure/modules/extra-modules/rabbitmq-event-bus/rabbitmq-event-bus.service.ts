import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {EnvNames} from "@infrastructure/env/env.name";
import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class RabbitMQEventBusService {
  constructor(
    private readonly env: ConfigService,
    private readonly amqpConn: AmqpConnection
  ) {}

  publishEvent<T>(eventName: string, data: T) {
    this.amqpConn.publish(
      this.env.get(EnvNames.RABBITMQ_EVENT_BUS_NAME),
      eventName,
      data
    );
  }
}
