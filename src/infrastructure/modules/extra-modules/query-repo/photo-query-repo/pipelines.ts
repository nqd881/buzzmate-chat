import { FileBasePipeline } from "../file-query-repo/pipelines";
import { AggOps, Expr, Lookup, Match, Project, Unwind } from "../shared/common";

export const PhotoBasePipeline = [
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
    Fields: {
      id: "$_id",
      width: "$width",
      height: "$height",
      file: "$__file",
      url: "",
    },
  }),
];
