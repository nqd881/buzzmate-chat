import { MaybePromise } from "@libs/utilities/types";
import { PhotoResponseDto } from "./response-dto";

export type QueryPhotosOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export interface IPhotoQueryRepo {
  queryPhotos(options?: QueryPhotosOptions): MaybePromise<PhotoResponseDto[]>;
}
