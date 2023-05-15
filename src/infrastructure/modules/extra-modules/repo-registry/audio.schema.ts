import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DbFile, DbFileSchema } from "./file.schema";

@Schema({
  versionKey: false,
})
export class DbAudio {
  @Prop()
  title: string;

  @Prop()
  duration: number;

  @Prop({ type: DbFileSchema })
  file: DbFile;
}

export const DbAudioSchema = SchemaFactory.createForClass(DbAudio);
