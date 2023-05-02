import { MaybePromise } from "@libs/utilities/types";
import { ChatQueryModel } from "./query-model";

export type QueryChatsOptions = {
  byIds?: string[];
  limit?: number;
  fave?: boolean;
  archived?: boolean;
  returnPersonal?: boolean;
};

export interface IChatQueryRepo {
  queryChats(
    userId: string,
    options?: QueryChatsOptions
  ): MaybePromise<ChatQueryModel[]>;
}
