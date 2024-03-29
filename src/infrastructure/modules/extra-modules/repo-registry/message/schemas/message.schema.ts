import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { MongoDocBase } from "../../mongo-doc-base";
import { DbAudio, DbAudioSchema } from "../../audio.schema";
import { DbDocument, DbDocumentSchema } from "../../document.schema";
import { DbVideo, DbVideoSchema } from "../../video.schema";
import { DbPhoto, DbPhotoSchema } from "../../photo.schema";

@Schema({ _id: false })
export class DbMessageReaction {
  @Prop()
  memberId: string;

  @Prop()
  reactionValue: string;
}

export const DbMessageReactionSchema =
  SchemaFactory.createForClass(DbMessageReaction);

@Schema({ _id: false })
export class DbMessageForwardInfo {
  @Prop()
  fromChatId: string;

  @Prop()
  fromMessageId: string;

  @Prop()
  senderUserId: string;
}

export const DbMessageForwardInfoSchema =
  SchemaFactory.createForClass(DbMessageForwardInfo);

@Schema({ discriminatorKey: "contentType" })
export abstract class DbMessageContent {
  @Prop({
    type: String,
    required: true,
  })
  contentType: string;
}

@Schema()
export class DbMessageContentText extends DbMessageContent {
  @Prop()
  text: string;
}

@Schema()
export class DbMessageContentPhoto extends DbMessageContent {
  @Prop()
  caption: string;

  @Prop({ type: DbPhotoSchema })
  photo: DbPhoto;
}

@Schema()
export class DbMessageContentVideo extends DbMessageContent {
  @Prop()
  caption: string;

  @Prop({ type: DbVideoSchema })
  video: DbVideo;
}

@Schema()
export class DbMessageContentDocument extends DbMessageContent {
  @Prop()
  caption: string;

  @Prop({ type: DbDocumentSchema })
  document: DbDocument;
}

@Schema()
export class DbMessageContentAudio extends DbMessageContent {
  @Prop()
  caption: string;

  @Prop({ type: DbAudioSchema })
  audio: DbAudio;
}

@Schema({
  versionKey: false,
})
export class DbMessage extends MongoDocBase {
  @Prop({ index: true })
  chatId: string;

  @Prop()
  senderUserId: string;

  @Prop({ type: mongoose.SchemaTypes.Mixed })
  content: DbMessageContent;

  @Prop({ index: true })
  isPinned: boolean;

  @Prop()
  isHidden: boolean;

  @Prop({ index: "desc" })
  date: Date;

  @Prop()
  editDate: Date;

  @Prop()
  replyToMessageId: string;

  @Prop({ type: DbMessageForwardInfo })
  forwardInfo: DbMessageForwardInfo;

  @Prop({ type: [DbMessageReactionSchema] })
  reactions: DbMessageReaction[];
}

export const DbMessageSchema = SchemaFactory.createForClass(DbMessage);
