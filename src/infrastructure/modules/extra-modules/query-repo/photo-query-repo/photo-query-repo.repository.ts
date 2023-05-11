import {
  IPhotoQueryRepo,
  QueryChatPhotosOptions,
} from "@application/query-repo/photo-query-repo.interface";
import { IPhotoQueryModel } from "@application/query-repo/query-model";
import { Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import { AggOps, Expr, Match } from "../shared/common";
import { MongoUtils } from "../shared/mongo-utils";
import { PhotoBasePipeline } from "./pipelines";

@Injectable()
export class PhotoQueryRepo implements IPhotoQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryChatPhotos(options?: QueryChatPhotosOptions) {
    const { chatId, byIds } = options;

    const photos = (await this.mongoUtils
      .getCollection("dbphotos")
      .aggregate(
        [
          Match(
            Expr(
              AggOps.And([
                AggOps.Eq("$chatId", chatId),
                AggOps.In("$_id", byIds),
              ])
            )
          ),
          ...PhotoBasePipeline,
        ].filter((stage) => !isNil(stage))
      )
      .toArray()) as IPhotoQueryModel[];

    return photos;
  }
}
