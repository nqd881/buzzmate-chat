import { MaybePromise } from "@libs/utilities/types";
import { ChatMemberResponseDto } from "./response-dto";

export type QueryMembersOptions = {
  chatId: string;
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IMemberQueryRepo {
  queryMembers(
    options?: QueryMembersOptions
  ): MaybePromise<ChatMemberResponseDto[]>;
}
