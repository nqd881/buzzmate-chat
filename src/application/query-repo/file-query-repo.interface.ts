import { MaybePromise } from "@libs/utilities/types";
import { FileQueryModel } from "./query-model";

export type QueryFilesOptions = {};

export interface IFileQueryRepo {
  queryFiles(options?: QueryFilesOptions): MaybePromise<FileQueryModel[]>;
}
