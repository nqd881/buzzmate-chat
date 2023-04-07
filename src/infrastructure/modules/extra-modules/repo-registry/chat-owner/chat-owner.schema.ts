import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MongoDocBase} from "../mongo-doc-base";

@Schema({
  versionKey: false,
})
export class DbChatOwner extends MongoDocBase {
  @Prop()
  userId: string;

  @Prop()
  maxCreations: number;

  @Prop()
  chatIds: string[];
}

export const DbChatOwnerSchema = SchemaFactory.createForClass(DbChatOwner);
