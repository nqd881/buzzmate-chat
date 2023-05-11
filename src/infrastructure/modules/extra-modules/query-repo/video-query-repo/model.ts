import { IVideoQueryModel } from "@application/query-repo/query-model";
import { FileQueryModel } from "../file-query-repo/model";
import { Type } from "class-transformer";

export interface VideoQueryModelTransformOptions {
  chatId: string;
}

export class VideoQueryModel implements IVideoQueryModel {
  id: string;

  width: number;

  height: number;

  duration: number;

  thumbnail: any;

  @Type(() => FileQueryModel)
  file: FileQueryModel;

  url: string;
}
