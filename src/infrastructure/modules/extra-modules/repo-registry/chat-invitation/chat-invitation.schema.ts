import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoDocBase } from "../mongo-doc-base";

@Schema({
  versionKey: false,
})
export class DbInvitation extends MongoDocBase {
  @Prop()
  chatId: string;

  @Prop()
  inviterUserId: string;

  @Prop()
  invitedUserId: string;

  @Prop()
  expiredAt: Date;

  @Prop()
  response: string;
}

export const DbInvitationSchema = SchemaFactory.createForClass(DbInvitation);
