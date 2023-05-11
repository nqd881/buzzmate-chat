import { MaybePromise } from "@libs/utilities/types";
import { IFileQueryModel } from "./query-model";

export type QueryFilesOptions = {};

export interface IFileQueryRepo {
  queryFiles(options?: QueryFilesOptions): MaybePromise<IFileQueryModel[]>;
}
