import {
  IDocumentQueryRepo,
  QueryChatDocumentsOptions,
} from "@application/query-repo/document-query-repo.interface";
import { DocumentQueryModel } from "@application/query-repo/query-model";
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
export class DocumentQueryRepo implements IDocumentQueryRepo, OnModuleInit {
  constructor(private mongoUtils: MongoUtils) {}

  async onModuleInit() {
    const collectionName = VIEW_COLLECTION_NAMES.DOCUMENT;

    const isExisting = await this.mongoUtils.collectionIsExisting(
      collectionName
    );

    if (isExisting)
      await this.mongoUtils.getDb().dropCollection(collectionName);

    await this.mongoUtils.getDb().createCollection(collectionName, {
      viewOn: "dbdocuments",
      pipeline: [
        LookupBasic(VIEW_COLLECTION_NAMES.FILE, "fileId", "id", "__file"),
        Unwind("$__file"),
        Project({
          Id: false,
          Fields: {
            id: "$_id",
            file: "$__file",
            url: "",
          },
        }),
      ],
    });
  }

  async queryChatDocuments(options?: QueryChatDocumentsOptions) {
    const { chatId, byIds } = options;

    const documents = await this.mongoUtils
      .getCollection(VIEW_COLLECTION_NAMES.DOCUMENT)
      .aggregate(
        [Match(Expr(AggOps.In("$id", byIds)))].filter((stage) => !isNil(stage))
      )
      .toArray();

    return documents as DocumentQueryModel[];
  }
}
