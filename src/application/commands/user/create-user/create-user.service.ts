import {Repositories} from "@application/di-tokens/repositories";
import {User} from "@domain/models/user/user";
import {UserPrivacy, UserScopes} from "@domain/models/user/user-privacy";
import {IUserRepo} from "@domain/models/user/user-repo.interface";
import {Inject, Injectable} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreateUserCommand} from "./create-user.command";

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    @Inject(Repositories.User) private readonly userRepo: IUserRepo
  ) {}

  async execute(command: CreateUserCommand) {
    const {identity, name, emailAddress, type} = command;

    const user = User.create({
      identity,
      name,
      emailAddress,
      type,
      chats: [],
      privacy: new UserPrivacy({
        canBeAddedBy: UserScopes.EVERYBODY,
      }),
    });

    await this.userRepo.save(user);
  }
}
