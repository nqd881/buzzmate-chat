import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {EnvNames} from "@infrastructure/env/env.name";
import {Global, Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {RabbitMQEventBusService} from "./rabbitmq-event-bus.service";

@Global()
@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (env: ConfigService) => {
        const host = env.get(EnvNames.RABBITMQ_HOST);
        const port = env.get(EnvNames.RABBITMQ_PORT);

        const uri = `amqp://${host}:${port}`;

        return {
          uri,
          exchanges: [
            {
              name: env.get(EnvNames.RABBITMQ_EVENT_BUS_NAME),
              type: "topic",
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RabbitMQEventBusService],
  exports: [RabbitMQEventBusService, RabbitMQModule],
})
export class RabbitMQEventBusModule {}
