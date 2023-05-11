import { IDocumentQueryModel } from "@application/query-repo/query-model";
import { FileQueryModel } from "../file-query-repo/model";
import { Transform, Type } from "class-transformer";

export class DocumentQueryModel implements IDocumentQueryModel {
  id: string;

  @Type(() => FileQueryModel)
  file: FileQueryModel;

  @Transform(({ value }) => {})
  url: string;
}
