import { MaybePromise } from "@libs/utilities/types";
import { MessageResponseDto } from "./response-dto";

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
  ): MaybePromise<MessageResponseDto[]>;
}
