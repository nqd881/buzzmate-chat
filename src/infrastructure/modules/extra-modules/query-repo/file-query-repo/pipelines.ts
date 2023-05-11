import { Project } from "../shared/common";

export const FileBasePipeline = [
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
