import {
  IFileQueryRepo,
  QueryFilesOptions,
} from "@application/query-repo/file-query-repo.interface";
import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { MongoUtils } from "../shared/mongo-utils";

@Injectable()
export class FileQueryRepo implements IFileQueryRepo {
  constructor(
    @InjectConnection() private conn: Connection,
    private mongoUtils: MongoUtils
  ) {}

  queryFiles(options: QueryFilesOptions) {
    return null;
  }
}
