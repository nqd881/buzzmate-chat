import {CreateUserCommand} from "@application/commands/user/create-user/create-user.command";
import {UserTypes} from "@domain/models/user/user";
import {RabbitPayload} from "@golevelup/nestjs-rabbitmq";
import {Iam_UserActivated} from "@infrastructure/integration-event/iam/user-activated";
import {RabbitMQEventBusSubscribe} from "@infrastructure/modules/extra-modules/rabbitmq-event-bus/decorators";
import {Injectable} from "@nestjs/common";
import {CommandBus} from "@nestjs/cqrs";

@Injectable()
export class MessagingService {
  constructor(private readonly commandBus: CommandBus) {}

  @RabbitMQEventBusSubscribe({
    routingKey: "iam.user_activated",
    queue: "buzzmate-chat-queue",
  })
  createOrActivateUser(@RabbitPayload() message: Iam_UserActivated) {
    const command = new CreateUserCommand({
      identity: message["userId"],
      name: message["name"],
      emailAddress: message["emailAddress"],
      type: UserTypes.Standard,
    });

    this.commandBus.execute(command);
  }
}
