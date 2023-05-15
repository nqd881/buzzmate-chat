import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MemberBasePipeline } from "../member-query-repo/pipelines";
import {
  AggOps,
  Expr,
  Lookup,
  Match,
  Project,
  Set,
  Unwind,
} from "../shared/common";
import { MessageContentPhoto } from "@domain/models/message/message-content/photo.content";
import { MessageContentAudio } from "@domain/models/message/message-content/audio.content";
import { MessageContentVideo } from "@domain/models/message/message-content/video.content";
import { MessageContentDocument } from "@domain/models/message/message-content/document.content";
import { HOST } from "../shared/constants";

const PROTOCOL = "http";

export const MessageBasePipeline = [
  Set({ id: "$_id" }),
  Set({
    "content.text": AggOps.Switch(
      [
        {
          case: AggOps.Eq("$content.contentType", MessageContentText.name),
          then: "$content.text",
        },
        {
          case: AggOps.In("$content.contentType", [
            MessageContentPhoto.name,
            MessageContentVideo.name,
            MessageContentAudio.name,
            MessageContentDocument.name,
          ]),
          then: "$content.caption",
        },
      ],
      null
    ),
    "content.photo": AggOps.Cond(
      AggOps.Eq("$content.contentType", MessageContentPhoto.name),
      {
        height: "$content.photo.height",
        width: "$content.photo.width",
        size: "$content.photo.file.size",
        mimetype: "$content.photo.file.mimetype",
        url: {
          $concat: [
            PROTOCOL,
            "://",
            HOST,
            "/api/chat-svc/chats/",
            "$chatId",
            "/messages/",
            "$id",
            "/file",
          ],
        },
      },
      []
    ),
    "content.video": AggOps.Cond(
      AggOps.Eq("$content.contentType", MessageContentVideo.name),
      {
        height: "$content.video.height",
        width: "$content.video.width",
        duration: "$content.video.duration",
        thumbnail: null,
        size: "$content.video.file.size",
        mimetype: "$content.video.file.mimetype",
        url: {
          $concat: [
            PROTOCOL,
            "://",
            HOST,
            "/api/chat-svc/chats/",
            "$chatId",
            "/messages/",
            "$id",
            "/file",
          ],
        },
      },
      []
    ),
    "content.audio": AggOps.Cond(
      AggOps.Eq("$content.contentType", MessageContentAudio.name),
      {
        title: "$content.audio.title",
        duration: "$content.audio.duration",
        size: "$content.audio.file.size",
        mimetype: "$content.audio.file.mimetype",
        url: {
          $concat: [
            PROTOCOL,
            "://",
            HOST,
            "/api/chat-svc/chats/",
            "$chatId",
            "/messages/",
            "$id",
            "/file",
          ],
        },
      },
      []
    ),
    "content.document": AggOps.Cond(
      AggOps.Eq("$content.contentType", MessageContentDocument.name),
      {
        duration: "$content.document.file.name",
        size: "$content.document.file.size",
        mimetype: "$content.document.file.mimetype",
        url: {
          $concat: [
            PROTOCOL,
            "://",
            HOST,
            "/api/chat-svc/chats/",
            "$chatId",
            "/messages/",
            "$id",
            "/file",
          ],
        },
      },
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
  Project({
    Id: false,
    Include: {
      id: 1,
      chatId: 1,
      senderUserId: 1,
      content: {
        text: 1,
        photo: 1,
        video: 1,
        audio: 1,
        document: 1,
      },
      date: 1,
      editDate: 1,
      replyToMessageId: 1,
      forwardInfo: 1,
      seemByUserIds: 1,
      views: 1,
      reactions: 1,
      sentByMember: 1,
    },
  }),
];
