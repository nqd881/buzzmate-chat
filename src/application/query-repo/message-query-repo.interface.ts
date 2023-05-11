import { MaybePromise } from "@libs/utilities/types";
import { IMessageQueryModel } from "./query-model";

export type QueryMessagesOptions = {
  chatId: string;
  limit?: number;
  byIds?: string[];
  byTimeEndpoint?: {
    afterTime?: Date | number;
    beforeTime?: Date | number;
  };
  byIdEndpoint?: {
    afterMessageId?: string;
    beforeMessageId?: string;
  };
};

export interface IMessageQueryRepo {
  queryMessages(
    userId: string,
    options?: QueryMessagesOptions
  ): MaybePromise<IMessageQueryModel[]>;
}
