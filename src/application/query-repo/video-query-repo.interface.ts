import { MaybePromise } from "@libs/utilities/types";
import { VideoQueryModel } from "./query-model";

export type QueryVideosOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IVideoQueryRepo {
  queryVideos(options?: QueryVideosOptions): MaybePromise<VideoQueryModel[]>;
}
