import {
  IPhotoQueryRepo,
  QueryChatPhotosOptions,
} from "@application/query-repo/photo-query-repo.interface";
import { PhotoQueryModel } from "@application/query-repo/query-model";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { isNil } from "lodash";
import {
  AggOps,
  Expr,
  LookupBasic,
  Match,
  Project,
  Unwind,
} from "../shared/common";
import { VIEW_COLLECTION_NAMES } from "../shared/constants";
import { MongoUtils } from "../shared/mongo-utils";

@Injectable()
export class PhotoQueryRepo implements IPhotoQueryRepo, OnModuleInit {
  constructor(private mongoUtils: MongoUtils) {}

  async onModuleInit() {
    const collectionName = VIEW_COLLECTION_NAMES.PHOTO;

    const isExisting = await this.mongoUtils.collectionIsExisting(
      collectionName
    );

    if (isExisting)
      await this.mongoUtils.getDb().dropCollection(collectionName);

    await this.mongoUtils.getDb().createCollection(collectionName, {
      viewOn: "dbphotos",
      pipeline: [
        LookupBasic(VIEW_COLLECTION_NAMES.FILE, "fileId", "id", "__file"),
        Unwind("$__file"),
        Project({
          Id: false,
          Fields: {
            id: "$_id",
            width: "$width",
            height: "$height",
            file: "$__file",
          },
        }),
      ],
    });
  }

  async queryChatPhotos(options?: QueryChatPhotosOptions) {
    const { chatId, byIds } = options;

    const photos = await this.mongoUtils
      .getCollection(VIEW_COLLECTION_NAMES.PHOTO)
      .aggregate(
        [Match(Expr(AggOps.In("$id", byIds)))].filter((stage) => !isNil(stage))
      )
      .toArray();

    return photos as PhotoQueryModel[];
  }
}
