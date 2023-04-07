import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoDocBase } from "../mongo-doc-base";

@Schema({
  versionKey: false,
})
export class DbChatAdmin extends MongoDocBase {
  @Prop()
  chatId: string;

  @Prop()
  userId: string;
}

export const DbChatAdminSchema = SchemaFactory.createForClass(DbChatAdmin);
