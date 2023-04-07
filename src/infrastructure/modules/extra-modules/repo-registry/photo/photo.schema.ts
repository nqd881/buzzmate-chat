import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MongoDocBase} from "../mongo-doc-base";

@Schema({
  _id: false,
})
export class DbPhotoSize {
  @Prop()
  type: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  fileId: string;
}

const DbPhotoSizeSchema = SchemaFactory.createForClass(DbPhotoSize);

@Schema({
  versionKey: false,
})
export class DbPhoto extends MongoDocBase {
  @Prop()
  chatId: string;

  @Prop()
  original: DbPhotoSize;

  @Prop({type: [DbPhotoSizeSchema]})
  variants: DbPhotoSize[];
}

export const DbPhotoSchema = SchemaFactory.createForClass(DbPhoto);
