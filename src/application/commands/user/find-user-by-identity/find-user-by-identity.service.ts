import {Repositories} from "@application/di-tokens/repositories";
import {IUserRepo} from "@domain/models/user/user-repo.interface";
import {Inject} from "@nestjs/common";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {FindUserByIdentityCommand} from "./find-user-by-identity.command";

@CommandHandler(FindUserByIdentityCommand)
export class FindUserByIdentityService
  implements ICommandHandler<FindUserByIdentityCommand>
{
  constructor(
    @Inject(Repositories.User) private readonly userRepo: IUserRepo
  ) {}

  async execute(command: FindUserByIdentityCommand) {
    const {identity} = command;

    const user = await this.userRepo.findOneByIdentity(identity);

    return user;
  }
}
