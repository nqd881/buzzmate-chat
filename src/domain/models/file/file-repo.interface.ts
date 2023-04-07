import {File} from "@domain/models/file/file";
import {IRepositoryBase} from "@libs/ddd";

export interface IFileRepo extends IRepositoryBase<File> {}
