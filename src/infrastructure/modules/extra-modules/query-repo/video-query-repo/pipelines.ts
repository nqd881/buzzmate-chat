import { FileBasePipeline } from "../file-query-repo/pipelines";
import { AggOps, Expr, Lookup, Match, Project, Unwind } from "../shared/common";

export const VideoBasePipeline = [
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
      width: 1,
      height: 1,
      duration: 1,
    },
    Fields: {
      id: "$_id",
      file: "$__file",
      url: "",
    },
  }),
];
