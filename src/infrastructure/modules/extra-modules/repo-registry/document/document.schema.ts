import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoDocBase } from "../mongo-doc-base";

@Schema({
  versionKey: false,
})
export class DbDocument extends MongoDocBase {
  @Prop()
  chatId: string;

  @Prop()
  fileId: string;
}

export const DbDocumentSchema = SchemaFactory.createForClass(DbDocument);
