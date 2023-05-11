import { MaybePromise } from "@libs/utilities/types";
import { IChatQueryModel } from "./query-model";

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
  ): MaybePromise<IChatQueryModel[]>;
}
