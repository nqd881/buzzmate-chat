import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MongoDocBase} from "../mongo-doc-base";

@Schema({
  versionKey: false,
})
export class DbChat extends MongoDocBase {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  ownerId: string;

  @Prop()
  status: string;

  @Prop()
  lastMessageId: string;

  @Prop()
  type: string;

  @Prop()
  accessKey: string;

  @Prop()
  memberCount: number;
}

export const DbChatSchema = SchemaFactory.createForClass(DbChat);
