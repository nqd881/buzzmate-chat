import { Injectable } from "@nestjs/common";
import { MongoUtils } from "../mongo-utils";
import {
  IMessageQueryRepo,
  QueryMessagesOptions,
} from "@application/query-repo/message-query-repo.interface";
import { isNil } from "lodash";
import {
  AggOps,
  Expr,
  Facet,
  Limit,
  Lookup,
  Match,
  Project,
  ReplaceRoot,
  Set,
  Sort,
  Unwind,
} from "../common";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageContentMedia } from "@domain/models/message/message-content/media.content";
import { MemberGeneralPipelines } from "../member-query-repo/member-query-repo.repository";
import { PhotoGeneralPipelines } from "../photo-query-repo/photo-query-repo.repository";
import { VideoGeneralPipelines } from "../video-query-repo/video-query-repo.repository";
import { DocumentGeneralPipelines } from "../document-query-repo/document-query-repo.repository";
import { MessageResponseDto } from "@application/query-repo/response-dto";

export const MessageGeneralPipelines = [
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
    "dbchatmembers",
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
      ...MemberGeneralPipelines,
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
    [Match(Expr(AggOps.In("$_id", "$$photoIds"))), ...PhotoGeneralPipelines],
    "content.photos"
  ),
  Lookup(
    "dbvideos",
    {
      videoIds: "$content.videoIds",
    },
    [Match(Expr(AggOps.In("$_id", "$$videoIds"))), ...VideoGeneralPipelines],
    "content.videos"
  ),
  Lookup(
    "dbdocuments",
    {
      documentIds: "$content.documentIds",
    },
    [
      Match(Expr(AggOps.In("$_id", "$$documentIds"))),
      ...DocumentGeneralPipelines,
    ],
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

@Injectable()
export class MessageQueryRepo implements IMessageQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryMessages(userId: string, options?: QueryMessagesOptions) {
    const { chatId, byIds, byTimeEndpoint, byIdEndpoint, limit } =
      options || {};

    const shouldQueryByIds = byIds?.length > 0;
    const shouldQueryByTimeEndpoint = Object.entries(byTimeEndpoint || {}).some(
      ([key, value]) => !isNil(value)
    );
    const shouldQueryByIdEndpoint = Object.entries(byIdEndpoint || {}).some(
      ([key, value]) => !isNil(value)
    );

    const ByIds = () => [
      Match(byIds ? Expr(AggOps.In("$_id", byIds)) : {}),
      Sort({
        date: 1,
        _id: 1,
      }),
    ];

    const ByTimeEndpoint = () => {
      const { beforeTime, afterTime } = byTimeEndpoint;

      if (!beforeTime && !afterTime) return [];

      if (beforeTime && afterTime) {
        return [
          Match(
            Expr(
              AggOps.And([
                AggOps.Gt("$date", new Date(afterTime)),
                AggOps.Lt("$date", new Date(beforeTime)),
              ])
            )
          ),
          Sort({
            date: 1,
            _id: 1,
          }),
        ];
      }

      if (beforeTime) {
        return [
          Match(Expr(AggOps.Lt("$date", new Date(beforeTime)))),
          Sort({
            date: -1,
            _id: 1,
          }),
        ];
      }

      if (afterTime) {
        return [
          Match(Expr(AggOps.Gt("$date", new Date(afterTime)))),
          Sort({
            date: 1,
            _id: 1,
          }),
        ];
      }
    };

    const ByIdEndpoint = () => {
      const { beforeMessageId, afterMessageId } = byIdEndpoint;

      if (!beforeMessageId && !afterMessageId) return [];

      if (beforeMessageId && afterMessageId) {
        return [
          Facet({
            beforeMessage: [Match(Expr(AggOps.Eq("$_id", beforeMessageId)))],
            afterMessage: [Match(Expr(AggOps.Eq("$_id", afterMessageId)))],
          }),
          Lookup(
            "dbmessages",
            {
              beforeTime: { $first: "$beforeMessage.date" },
              afterTime: { $first: "$afterMessage.date" },
            },
            [
              Match(
                Expr(
                  AggOps.And([
                    AggOps.Gt("$date", "$$afterTime"),
                    AggOps.Lt("$date", "$$beforeTime"),
                  ])
                )
              ),
              Sort({
                date: 1,
                _id: 1,
              }),
            ],
            "__messages"
          ),
          Unwind("$__messages", true),
          Set({
            __messages: AggOps.IfNull("$__messages", {}),
          }),
          ReplaceRoot("$__messages"),
        ];
      }

      if (beforeMessageId) {
        return [
          Match(Expr(AggOps.Eq("$_id", beforeMessageId))),
          Lookup(
            "dbmessages",
            {
              beforeTime: "$date",
            },
            [
              Match(Expr(AggOps.Lt("$date", "$$beforeTime"))),
              Sort({
                date: -1,
                _id: 1,
              }),
            ],
            "__messages"
          ),
          Unwind("$__messages", true),
          Set({
            __messages: AggOps.IfNull("$__messages", {}),
          }),
          ReplaceRoot("$__messages"),
        ];
      }

      if (afterMessageId) {
        return [
          Match(Expr(AggOps.Eq("$_id", afterMessageId))),
          Lookup(
            "dbmessages",
            {
              afterTime: "$date",
            },
            [
              Match(Expr(AggOps.Gt("$date", "$$afterTime"))),
              Sort({
                date: 1,
                _id: 1,
              }),
            ],
            "__messages"
          ),
          Unwind("$__messages", true),
          Set({
            __messages: AggOps.IfNull("$__messages", {}),
          }),
          ReplaceRoot("$__messages"),
        ];
      }
    };

    const messages = await this.mongoUtils
      .getCollection("dbchatmembers")
      .aggregate(
        [
          Match(
            Expr(
              AggOps.And([
                AggOps.Eq("$userId", userId),
                AggOps.Eq("$chatId", chatId),
              ])
            )
          ),
          Lookup(
            "dbmessages",
            {
              chatId,
            },
            [
              Match(Expr(AggOps.Eq("$chatId", "$$chatId"))),
              ...(shouldQueryByIds
                ? ByIds()
                : shouldQueryByIdEndpoint
                ? ByIdEndpoint()
                : shouldQueryByTimeEndpoint
                ? ByTimeEndpoint()
                : []),

              ...MessageGeneralPipelines,
              limit ? Limit(limit) : null,
            ],
            "__messages"
          ),
          Unwind("$__messages"),
          ReplaceRoot("$__messages"),
          Sort({
            date: 1,
            id: 1,
          }),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return messages as MessageResponseDto[];
  }
}