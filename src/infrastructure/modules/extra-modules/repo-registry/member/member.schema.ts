import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { MongoDocBase } from "../mongo-doc-base";

@Schema({
  discriminatorKey: "type",
})
export abstract class DbMemberStatus {
  @Prop()
  type: string;
}

@Schema({})
export class DbMemberStatusActive extends DbMemberStatus {}

@Schema({})
export class DbMemberStatusLeft extends DbMemberStatus {
  @Prop()
  leaveDate: Date;
}

@Schema({})
export class DbMemberStatusBanned extends DbMemberStatus {
  @Prop()
  bannedDate: Date;

  @Prop()
  reason: string;
}

@Schema({
  versionKey: false,
})
export class DbMember extends MongoDocBase {
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

  @Prop({ type: mongoose.SchemaTypes.Mixed })
  status: any;
}

export const DbMemberSchema = SchemaFactory.createForClass(DbMember);
