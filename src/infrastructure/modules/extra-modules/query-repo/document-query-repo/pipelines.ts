import { FileBasePipeline } from "../file-query-repo/pipelines";
import { AggOps, Expr, Lookup, Match, Project, Unwind } from "../shared/common";
import { HOST } from "../shared/constants";

export const DocumentBasePipeline = [
  Lookup(
    "dbfiles",
    {
      fileId: "$fileId",
    },
    [Match(Expr(AggOps.Eq("$_id", "$$fileId"))), ...FileBasePipeline],
    "__file"
  ),
  Unwind("$__file"),
  Project({
    Id: false,
    Include: {
      chatId: 1,
    },
    Fields: {
      id: "$_id",
      file: "$__file",
      url: {
        $concat: [
          `http://${HOST}/api/chat-svc/chats/`,
          "$chatId",
          "/documents/",
          "$_id",
        ],
      },
    },
  }),
];
