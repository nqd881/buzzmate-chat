import {
  IDocumentQueryRepo,
  QueryChatDocumentsOptions,
} from "@application/query-repo/document-query-repo.interface";
import { IDocumentQueryModel } from "@application/query-repo/query-model";
import { Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import { AggOps, Expr, Match } from "../shared/common";
import { MongoUtils } from "../shared/mongo-utils";
import { DocumentBasePipeline } from "./pipelines";

@Injectable()
export class DocumentQueryRepo implements IDocumentQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryChatDocuments(options?: QueryChatDocumentsOptions) {
    const { chatId, byIds } = options;

    const documents = await this.mongoUtils
      .getCollection("dbdocuments")
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
          ...DocumentBasePipeline,
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return documents as IDocumentQueryModel[];
  }
}
