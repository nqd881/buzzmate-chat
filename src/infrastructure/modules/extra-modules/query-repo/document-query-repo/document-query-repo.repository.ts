import {
  IDocumentQueryRepo,
  QueryChatDocumentsOptions,
} from "@application/query-repo/document-query-repo.interface";
import { DocumentQueryModel } from "@application/query-repo/query-model";
import { isNil } from "lodash";
import { AggOps, Expr, Lookup, Match, Project, Unwind } from "../common";
import { FileGeneralPipelines } from "../file-query-repo/file-query-repo.repository";
import { MongoUtils } from "../mongo-utils";
import { HOST } from "../shared";

export const DocumentGeneralPipelines = (chatId: string) => [
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
      file: "$__file",
      url: {
        $concat: [
          `http://${HOST}/api/chat-svc/chats/`,
          chatId,
          "/documents/",
          "$_id",
        ],
      },
    },
  }),
];

export class DocumentQueryRepo implements IDocumentQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryChatDocuments(options?: QueryChatDocumentsOptions) {
    const { chatId, byIds } = options;

    const documents = await this.mongoUtils
      .getCollection("dbdocuments")
      .aggregate(
        [
          Match(Expr(AggOps.In("$_id", byIds))),
          ...DocumentGeneralPipelines(chatId),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return documents as DocumentQueryModel[];
  }
}
