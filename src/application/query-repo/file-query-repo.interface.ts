import { MaybePromise } from "@libs/utilities/types";
import { FileResponseDto } from "./response-dto";

export type QueryFilesOptions = {};

export interface IFileQueryRepo {
  queryFiles(options?: QueryFilesOptions): MaybePromise<FileResponseDto[]>;
}
