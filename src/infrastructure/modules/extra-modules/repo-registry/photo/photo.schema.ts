import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoDocBase } from "../mongo-doc-base";

@Schema({
  versionKey: false,
})
export class DbPhoto extends MongoDocBase {
  @Prop()
  chatId: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  fileId: string;
}

export const DbPhotoSchema = SchemaFactory.createForClass(DbPhoto);
