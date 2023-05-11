import { MessageContentText } from "@domain/models/message/message-content/text.content";
import {
  AggOps,
  Expr,
  Lookup,
  Match,
  Project,
  Set,
  Unwind,
} from "../shared/common";
import { MessageContentMedia } from "@domain/models/message/message-content/media.content";
import { VideoBasePipeline } from "../video-query-repo/pipelines";
import { PhotoBasePipeline } from "../photo-query-repo/pipelines";
import { DocumentBasePipeline } from "../document-query-repo/pipelines";
import { MemberBasePipeline } from "../member-query-repo/pipelines";

export const MessageBasePipeline = [
  Set({
    id: "$_id",
    "content.text": AggOps.Switch(
      [
        {
          case: AggOps.Eq("$content.contentType", MessageContentText.name),
          then: "$content.text",
        },
        {
          case: AggOps.Eq("$content.contentType", MessageContentMedia.name),
          then: "$content.caption",
        },
      ],
      null
    ),
    "content.photoIds": AggOps.Cond(
      AggOps.Eq("$content.contentType", MessageContentMedia.name),
      "$content.photoIds",
      []
    ),
    "content.videoIds": AggOps.Cond(
      AggOps.Eq("$content.contentType", MessageContentMedia.name),
      "$content.videoIds",
      []
    ),
    "content.documentIds": AggOps.Cond(
      AggOps.Eq("$content.contentType", MessageContentMedia.name),
      "$content.documentIds",
      []
    ),
  }),
  Lookup(
    "dbmembers",
    {
      chatId: "$chatId",
      senderUserId: "$senderUserId",
    },
    [
      Match(
        Expr(
          AggOps.And([
            AggOps.Eq("$userId", "$$senderUserId"),
            AggOps.Eq("$chatId", "$$chatId"),
          ])
        )
      ),
      ...MemberBasePipeline,
    ],
    "sentByMember"
  ),
  Unwind("$sentByMember", true),
  Set({
    sentByMember: AggOps.IfNull("$sentByMember", {}),
  }),
  Lookup(
    "dbphotos",
    {
      photoIds: "$content.photoIds",
    },
    [Match(Expr(AggOps.In("$_id", "$$photoIds"))), ...PhotoBasePipeline],
    "content.photos"
  ),
  Lookup(
    "dbvideos",
    {
      videoIds: "$content.videoIds",
    },
    [Match(Expr(AggOps.In("$_id", "$$videoIds"))), ...VideoBasePipeline],
    "content.videos"
  ),
  Lookup(
    "dbdocuments",
    {
      documentIds: "$content.documentIds",
    },
    [Match(Expr(AggOps.In("$_id", "$$documentIds"))), ...DocumentBasePipeline],
    "content.documents"
  ),
  Project({
    Id: false,
    Include: {
      id: 1,
      chatId: 1,
      senderUserId: 1,
      date: 1,
      editDate: 1,
      replyToMessageId: 1,
      forwardInfo: 1,
      seemByUserIds: 1,
      views: 1,
      reactions: 1,
      sentByMember: 1,
    },
    Fields: {
      "content.text": "$content.text",
      "content.hasMedia": "$content.hasMedia",
      "content.photos": "$content.photos",
      "content.videos": "$content.videos",
      "content.documents": "$content.documents",
    },
  }),
];
