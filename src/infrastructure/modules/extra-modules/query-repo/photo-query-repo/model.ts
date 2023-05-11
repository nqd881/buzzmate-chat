import { IPhotoQueryModel } from "@application/query-repo/query-model";
import { FileQueryModel } from "../file-query-repo/model";
import { Type } from "class-transformer";

export class PhotoQueryModel implements IPhotoQueryModel {
  id: string;

  width: number;

  height: number;

  @Type(() => FileQueryModel)
  file: FileQueryModel;

  url: string;
}
