import { MaybePromise } from "@libs/utilities/types";
import { ChatResponseDto } from "./response-dto";

export type QueryChatsOptions = {
  byIds?: string[];
  limit?: number;
  fave?: boolean;
  archived?: boolean;
  returnPersonal?: boolean;
};

// export type GetUsersOptions = {
//   limit?: number;
//   byIds?: string[];
//   byEmails?: string[];
//   byNames?: string[];
//   exclude?: string[];
// };

export interface IChatQueryRepo {
  queryChats(
    userId: string,
    options?: QueryChatsOptions
  ): MaybePromise<ChatResponseDto[]>;

  //
  //
  //

  // getUsers(options?: GetUsersOptions): MaybePromise<UserResponseDto[]>;
}
