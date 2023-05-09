import { Injectable, OnModuleInit } from "@nestjs/common";
import { Project } from "../shared/common";
import {
  IFileQueryRepo,
  QueryFilesOptions,
} from "@application/query-repo/file-query-repo.interface";
import { MongoUtils } from "../shared/mongo-utils";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { VIEW_COLLECTION_NAMES } from "../shared/constants";

@Injectable()
export class FileQueryRepo implements IFileQueryRepo, OnModuleInit {
  constructor(
    @InjectConnection() private conn: Connection,
    private mongoUtils: MongoUtils
  ) {}

  async onModuleInit() {
    const collectionName = VIEW_COLLECTION_NAMES.FILE;

    const isExisting = await this.mongoUtils.collectionIsExisting(
      collectionName
    );

    if (isExisting)
      await this.mongoUtils.getDb().dropCollection(collectionName);

    await this.conn.createCollection(collectionName, {
      viewOn: "dbfiles",
      pipeline: [
        Project({
          Id: false,
          Include: {
            name: 1,
            size: 1,
            date: 1,
            mimetype: 1,
          },
          Fields: {
            id: "$_id",
          },
        }),
      ],
    });
  }

  queryFiles(options: QueryFilesOptions) {
    return null;
  }
}
