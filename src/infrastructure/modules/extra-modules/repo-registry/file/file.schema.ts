import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoDocBase } from "../mongo-doc-base";

@Schema({
  versionKey: false,
})
export class DbFile extends MongoDocBase {
  @Prop()
  name: string;

  @Prop()
  mimetype: string;

  @Prop()
  size: number;

  @Prop()
  date: Date;
}

export const DbFileSchema = SchemaFactory.createForClass(DbFile);
