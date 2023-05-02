import { MaybePromise } from "@libs/utilities/types";
import { VideoResponseDto } from "./response-dto";

export type QueryVideosOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IVideoQueryRepo {
  queryVideos(options?: QueryVideosOptions): MaybePromise<VideoResponseDto[]>;
}
