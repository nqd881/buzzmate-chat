import {
  IMessageContentQueryModel,
  IMessageForwardInfoQueryModel,
  IMessageQueryModel,
} from "@application/query-repo/query-model";
import { DocumentQueryModel } from "../document-query-repo/model";
import { VideoQueryModel } from "../video-query-repo/model";
import { PhotoQueryModel } from "../photo-query-repo/model";
import { MemberQueryModel } from "../member-query-repo/model";
import { Type } from "class-transformer";

export class MessageContentQueryModel implements IMessageContentQueryModel {
  text: string;

  @Type(() => PhotoQueryModel)
  photos: PhotoQueryModel[];

  @Type(() => VideoQueryModel)
  videos: VideoQueryModel[];

  @Type(() => DocumentQueryModel)
  documents: DocumentQueryModel[];
}

export class MessageForwardInfoQueryModel
  implements IMessageForwardInfoQueryModel
{
  fromChatId: string;

  fromMessageId: string;

  senderUserId: string;
}

export class MessageQueryModel implements IMessageQueryModel {
  id: string;

  chatId: string;

  senderUserId: string;

  @Type(() => MemberQueryModel)
  sentByMember: MemberQueryModel;

  @Type(() => MessageContentQueryModel)
  content: MessageContentQueryModel;

  date: number;

  editDate: number;

  replyToMessageId: string;

  @Type(() => MessageForwardInfoQueryModel)
  forwardInfo?: MessageForwardInfoQueryModel;

  seenByUserIds?: string[];

  views?: number;

  reactions?: any;
}
