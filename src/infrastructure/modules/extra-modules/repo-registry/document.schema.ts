import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DbFile, DbFileSchema } from "./file.schema";

@Schema({
  versionKey: false,
})
export class DbDocument {
  @Prop({ type: DbFileSchema })
  file: DbFile;
}

export const DbDocumentSchema = SchemaFactory.createForClass(DbDocument);
