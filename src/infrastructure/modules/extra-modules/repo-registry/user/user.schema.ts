import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MongoDocBase} from "../mongo-doc-base";

@Schema({
  _id: false,
})
export class DbUserPrivacy {
  @Prop()
  canBeAddedBy: string;
}

const DbUserPrivacySchema = SchemaFactory.createForClass(DbUserPrivacy);

@Schema({
  _id: false,
})
export class DbUserChat {
  @Prop()
  chatId: string;

  @Prop()
  isFave: boolean;

  @Prop()
  isArchived: boolean;
}

const DbUserChatSchema = SchemaFactory.createForClass(DbUserChat);

@Schema({
  versionKey: false,
})
export class DbUser extends MongoDocBase {
  @Prop()
  identity: string;

  @Prop()
  name: string;

  @Prop()
  emailAddress: string;

  @Prop()
  type: string;

  @Prop({type: [DbUserChatSchema]})
  chats: DbUserChat[];

  @Prop({type: DbUserPrivacySchema})
  privacy: DbUserPrivacy;
}

export const DbUserSchema = SchemaFactory.createForClass(DbUser);
