import { Injectable } from "@nestjs/common";
import { Project } from "../common";
import {
  IFileQueryRepo,
  QueryFilesOptions,
} from "@application/query-repo/file-query-repo.interface";

export const FileGeneralPipelines = [
  Project({
    Id: false,
    Include: {
      name: 1,
      size: 1,
      date: 1,
      mimetype: 1,
    },
    Fields: {
      id: "$_id",
    },
  }),
];

@Injectable()
export class FileQueryRepo implements IFileQueryRepo {
  constructor() {}

  queryFiles(options: QueryFilesOptions) {
    return null;
  }
}
