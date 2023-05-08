import {
  IPhotoQueryRepo,
  QueryChatPhotosOptions,
} from "@application/query-repo/photo-query-repo.interface";
import { MongoUtils } from "../mongo-utils";
import { PhotoQueryModel } from "@application/query-repo/query-model";
import { AggOps, Expr, Lookup, Match, Project, Unwind } from "../common";
import { isNil } from "lodash";
import { FileGeneralPipelines } from "../file-query-repo/file-query-repo.repository";
import { HOST } from "../shared";
import { Injectable } from "@nestjs/common";

export const PhotoGeneralPipelines = (chatId: string) => [
  Lookup(
    "dbfiles",
    {
      fileId: "$fileId",
    },
    [Match(Expr(AggOps.Eq("$_id", "$$fileId"))), ...FileGeneralPipelines],
    "__file"
  ),
  Unwind("$__file"),
  Project({
    Id: false,
    Fields: {
      id: "$_id",
      width: "$width",
      height: "$height",
      file: "$__file",
      url: {
        $concat: [
          `http://${HOST}/api/chat-svc/chats/`,
          chatId,
          "/photos/",
          "$_id",
        ],
      },
    },
  }),
];

@Injectable()
export class PhotoQueryRepo implements IPhotoQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryChatPhotos(options?: QueryChatPhotosOptions) {
    const { chatId, byIds } = options;

    const photos = await this.mongoUtils
      .getCollection("dbphotos")
      .aggregate(
        [
          Match(Expr(AggOps.In("$_id", byIds))),
          ...PhotoGeneralPipelines(chatId),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return photos as PhotoQueryModel[];
  }
}
