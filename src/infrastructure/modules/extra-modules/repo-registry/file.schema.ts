import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  versionKey: false,
})
export class DbFile {
  @Prop()
  name: string;

  @Prop()
  mimetype: string;

  @Prop()
  size: number;
}

export const DbFileSchema = SchemaFactory.createForClass(DbFile);
