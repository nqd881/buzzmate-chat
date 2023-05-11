import { IFileQueryModel } from "@application/query-repo/query-model";

export class FileQueryModel implements IFileQueryModel {
  id: string;
  name: string;
  size: number;
  mimetype: string;
  date: Date;
}
