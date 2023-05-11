import { MaybePromise } from "@libs/utilities/types";
import { IVideoQueryModel } from "./query-model";

export type QueryChatVideosOptions = {
  chatId: string;
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IVideoQueryRepo {
  queryChatVideos(
    options?: QueryChatVideosOptions
  ): MaybePromise<IVideoQueryModel[]>;
}
