import {User} from "@domain/models/user/user";
import {IRepositoryBase} from "@libs/ddd";
import {MaybePromise} from "@libs/utilities/types";

export interface IUserRepo extends IRepositoryBase<User> {
  findOneByIdentity(identity: string): MaybePromise<User>;
}
