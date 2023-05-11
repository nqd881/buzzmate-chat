import { MaybePromise } from "@libs/utilities/types";
import { IMemberQueryModel } from "./query-model";

export type QueryMembersOptions = {
  chatId: string;
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IMemberQueryRepo {
  queryMembers(
    options?: QueryMembersOptions
  ): MaybePromise<IMemberQueryModel[]>;
}
