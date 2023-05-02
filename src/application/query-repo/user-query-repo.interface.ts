import { MaybePromise } from "@libs/utilities/types";
import { UserQueryModel } from "./query-model";

export type QueryUsersOptions = {
  limit?: number;
  byIds?: string[];
  byEmails?: string[];
  byNames?: string[];
  exclude?: string[];
};

export interface IUserQueryRepo {
  queryUsers(options?: QueryUsersOptions): MaybePromise<UserQueryModel[]>;
}
