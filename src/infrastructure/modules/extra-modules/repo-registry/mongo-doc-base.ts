import {Prop} from "@nestjs/mongoose";

export class MongoDocBase {
  @Prop()
  _id: string;

  @Prop()
  __version: number;
}
