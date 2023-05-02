import { MaybePromise } from "@libs/utilities/types";
import { PhotoQueryModel } from "./query-model";

export type QueryPhotosOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IPhotoQueryRepo {
  queryPhotos(options?: QueryPhotosOptions): MaybePromise<PhotoQueryModel[]>;
}
