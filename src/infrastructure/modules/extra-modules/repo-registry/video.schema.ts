import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DbPhoto, DbPhotoSchema } from "./photo.schema";
import { DbFile, DbFileSchema } from "./file.schema";

@Schema({
  versionKey: false,
})
export class DbVideo {
  @Prop()
  duration: number;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop({ type: DbPhotoSchema })
  thumbnail: DbPhoto;

  @Prop({ type: DbFileSchema })
  file: DbFile;
}

export const DbVideoSchema = SchemaFactory.createForClass(DbVideo);
