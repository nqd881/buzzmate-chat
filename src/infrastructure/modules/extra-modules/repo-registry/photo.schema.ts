import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DbFile, DbFileSchema } from "./file.schema";

@Schema({
  versionKey: false,
})
export class DbPhoto {
  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop({ type: DbFileSchema })
  file: DbFile;
}

export const DbPhotoSchema = SchemaFactory.createForClass(DbPhoto);
