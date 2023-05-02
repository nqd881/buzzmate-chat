import { MaybePromise } from "@libs/utilities/types";
import { UserResponseDto } from "./response-dto";

export type QueryUsersOptions = {
  limit?: number;
  byIds?: string[];
  byEmails?: string[];
  byNames?: string[];
  exclude?: string[];
};

export interface IUserQueryRepo {
  queryUsers(options?: QueryUsersOptions): MaybePromise<UserResponseDto[]>;
}
