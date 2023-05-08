import { MaybePromise } from "@libs/utilities/types";
import { PhotoQueryModel } from "./query-model";

export type QueryChatPhotosOptions = {
  chatId: string;
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IPhotoQueryRepo {
  queryChatPhotos(
    options?: QueryChatPhotosOptions
  ): MaybePromise<PhotoQueryModel[]>;
}
