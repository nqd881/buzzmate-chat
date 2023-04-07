import { CreateUserService } from "@application/commands/user/create-user/create-user.service";
import { FindUserByIdentityService } from "@application/commands/user/find-user-by-identity/find-user-by-identity.service";
import { UserDomainEventHandlers } from "@application/domain-event-handlers/user";
import { Module } from "@nestjs/common";
import { Controller, Provider } from "@nestjs/common/interfaces";
import { CqrsModule } from "@nestjs/cqrs";
import { RepoRegistryModule } from "../extra-modules/repo-registry/repo-registry.module";
import { MessagingService } from "./services/messaging.service";
import { GetUsersController } from "./controllers/get-users.controller";
import { FindUsersService } from "@application/queries/find-users/find-users.service";
import { ChatQueryRepoModule } from "../extra-modules/query-repo/chat-query-repo/chat-query-repo.module";

export const commandHandlers: Provider[] = [
  CreateUserService,
  FindUserByIdentityService,
  FindUsersService,
];

export const eventHandlers: Provider[] = UserDomainEventHandlers;

export const controllers = [GetUsersController];

@Module({
  imports: [CqrsModule, RepoRegistryModule, ChatQueryRepoModule],
  controllers: [...controllers],
  providers: [...commandHandlers, ...eventHandlers, MessagingService],
  exports: [...commandHandlers],
})
export class UserModule {}
