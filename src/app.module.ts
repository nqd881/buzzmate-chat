import {EnvNames} from "@infrastructure/env/env.name";
import {ChatModule} from "@infrastructure/modules/chat/chat.module";
import {DomainEventBusModule} from "@infrastructure/modules/extra-modules/domain-event-bus/domain-event-bus.module";
import {RabbitMQEventBusModule} from "@infrastructure/modules/extra-modules/rabbitmq-event-bus/rabbitmq-event-bus.module";
import {UserModule} from "@infrastructure/modules/user/user.module";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {CqrsModule} from "@nestjs/cqrs";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CqrsModule,
    ConfigModule.forRoot({
      // envFilePath: "src/infrastructure/env/.dev.env",
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (env: ConfigService) => {
        return {
          uri: env.get(EnvNames.MONGODB_URI),
        };
      },
      inject: [ConfigService],
    }),
    RabbitMQEventBusModule,
    DomainEventBusModule,

    UserModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
