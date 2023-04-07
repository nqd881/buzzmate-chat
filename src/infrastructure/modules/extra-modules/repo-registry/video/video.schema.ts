import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MongoDocBase} from "../mongo-doc-base";

@Schema({
  _id: false,
})
export class DbThumbnail {
  @Prop()
  photoId: string;
}

@Schema({
  versionKey: false,
})
export class DbVideo extends MongoDocBase {
  @Prop()
  chatId: string;

  @Prop()
  duration: number;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop({type: DbThumbnail})
  thumbnail: DbThumbnail;

  @Prop()
  fileId: string;
}

export const DbVideoSchema = SchemaFactory.createForClass(DbVideo);
