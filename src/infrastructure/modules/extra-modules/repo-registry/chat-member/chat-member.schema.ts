import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";
import {MongoDocBase} from "../mongo-doc-base";

@Schema({
  discriminatorKey: "type",
})
export abstract class DbChatMemberStatus {
  @Prop()
  type: string;
}

@Schema({})
export class DbChatMemberStatusActive extends DbChatMemberStatus {}

@Schema({})
export class DbChatMemberStatusLeft extends DbChatMemberStatus {
  @Prop()
  leaveDate: Date;
}

@Schema({})
export class DbChatMemberStatusBanned extends DbChatMemberStatus {
  @Prop()
  bannedDate: Date;

  @Prop()
  reason: string;
}

@Schema({
  versionKey: false,
})
export class DbChatMember extends MongoDocBase {
  @Prop()
  chatId: string;

  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop()
  nickname: string;

  @Prop()
  inviterUserId: string;

  @Prop()
  joinedDate: Date;

  @Prop({type: mongoose.SchemaTypes.Mixed})
  status: any;
}

export const DbChatMemberSchema = SchemaFactory.createForClass(DbChatMember);
