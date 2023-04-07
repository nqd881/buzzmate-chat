import {
  GetChatsOptions,
  GetDocumentsOptions,
  GetMembersOptions,
  GetMessagesOptions,
  GetPhotosOptions,
  GetUsersOptions,
  GetVideosOptions,
  IChatQueryRepo,
} from "@application/query-repo/chat-query-repo.interface";
import {
  ChatMemberResponseDto,
  ChatResponseDto,
  MessageResponseDto,
  PhotoResponseDto,
  UserResponseDto,
  VideoResponseDto,
} from "@application/query-repo/response-dto";
import { ChatMemberStatusBanned } from "@domain/models/chat-member/chat-member-status/chat-member-status-banned";
import { ChatMemberStatusLeft } from "@domain/models/chat-member/chat-member-status/chat-member-status-left";
import { ChatTypes } from "@domain/models/chat/chat";
import { MessageContentAlbum } from "@domain/models/message/message-content/album.content";
import { MessageContentDocument } from "@domain/models/message/message-content/document.content";
import { MessageContentPhoto } from "@domain/models/message/message-content/photo.content";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageContentVideo } from "@domain/models/message/message-content/video.content";
import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { isNil } from "lodash";
import { Connection } from "mongoose";
import {
  Expr,
  Facet,
  Limit,
  Lookup,
  Match,
  Project,
  ReplaceRoot,
  ROOT,
  Set,
  Sort,
  Unset,
  Unwind,
} from "../common";
import AggOps from "../common/aggregation-pipeline.operators";
import { MaybePromise } from "@libs/utilities/types";

const ChatMemberGeneralPipelines = () => [
  Set({
    id: "$_id",
    leaveDate: AggOps.Cond(
      AggOps.Eq("$status.type", ChatMemberStatusLeft.name),
      "$status.leaveDate",
      null
    ),
    bannedDate: AggOps.Cond(
      AggOps.Eq("$status.type", ChatMemberStatusBanned.name),
      "$status.bannedDate",
      null
    ),
  }),
  Set({
    hasLeft: AggOps.Ne("$leaveDate", null),
    isBanned: AggOps.Ne("$bannedDate", null),
  }),
  Lookup(
    "dbchatowners",
    {
      chatId: "$chatId",
    },
    [
      Match(Expr(AggOps.In("$$chatId", "$chatIds"))),
      Project({
        Id: false,
        Include: {
          userId: 1,
        },
      }),
    ],

    "__owners"
  ),
  Lookup(
    "dbchatadmins",
    {
      chatId: "$chatId",
    },
    [
      Match(Expr(AggOps.Eq("$$chatId", "$chatId"))),
      Project({
        Id: false,
        Include: {
          userId: 1,
        },
      }),
    ],
    "__admins"
  ),
  Set({
    isOwner: AggOps.In("$userId", "$__owners.userId"),
    isAdmin: AggOps.In("$userId", "$__admins.userId"),
    // isMe: AggOps.Eq("$userId", UserId),
  }),
  Project({
    Id: false,
    Include: {
      id: 1,
      chatId: 1,
      userId: 1,
      name: 1,
      nickname: 1,
      inviterUserId: 1,
      joinedDate: 1,
      isBanned: 1,
      hasLeft: 1,
      leaveDate: 1,
      bannedDate: 1,
      isOwner: 1,
      isAdmin: 1,
      // isMe: 1,
    },
  }),
];

const MessageGeneralPipelines = () => [
  Set({
    id: "$_id",
    // sentByMyself: AggOps.Eq("$senderUserId", UserId),
    "content.hasMedias": {
      $cond: [
        {
          $in: [
            "$content.contentType",
            [
              MessageContentPhoto.name,
              MessageContentVideo.name,
              MessageContentDocument.name,
              MessageContentAlbum.name,
            ],
          ],
        },
        true,
        false,
      ],
    },
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
            MessageContentDocument.name,
            MessageContentAlbum.name,
          ]),
          then: "$content.caption",
        },
      ],
      null
    ),
    "content.photoIds": AggOps.Switch(
      [
        {
          case: AggOps.Eq("$content.contentType", MessageContentPhoto.name),
          then: ["$content.photoId"],
        },
        {
          case: AggOps.Eq("$content.contentType", MessageContentAlbum.name),
          then: "$content.photoIds",
        },
      ],
      []
    ),
    "content.videoIds": AggOps.Switch(
      [
        {
          case: AggOps.Eq("$content.contentType", MessageContentVideo.name),
          then: ["$content.videoId"],
        },
        {
          case: AggOps.Eq("$content.contentType", MessageContentAlbum.name),
          then: "$content.videoIds",
        },
      ],
      []
    ),
    "content.documentIds": AggOps.Switch(
      [
        {
          case: AggOps.Eq("$content.contentType", MessageContentDocument.name),
          then: ["$content.documentId"],
        },
        {
          case: AggOps.Eq("$content.contentType", MessageContentAlbum.name),
          then: "$content.documentIds",
        },
      ],
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
      ...ChatMemberGeneralPipelines(),
    ],
    "sentByMember"
  ),
  Unwind("$sentByMember", true),
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
      content: {
        text: 1,
        hasMedias: 1,
        photoIds: 1,
        videoIds: 1,
        documentIds: 1,
      },
      sentByMember: 1,
      // sentByMyself: 1,
    },
  }),
];

const ChatGeneralPipelines = () => [
  Set({
    id: "$_id",
    isGroupChat: AggOps.Eq("$type", ChatTypes.GROUP),
    isPrivateChat: AggOps.Eq("$type", ChatTypes.PRIVATE),
    isSelfChat: AggOps.Eq("$type", ChatTypes.SELF),
  }),
  Lookup(
    "dbmessages",
    {
      lastMessageId: "$lastMessageId",
    },
    [
      Match(Expr(AggOps.Eq("$_id", "$$lastMessageId"))),
      ...MessageGeneralPipelines(),
    ],
    "lastMessage"
  ),
  Unwind("$lastMessage", true),
  Set({
    lastMessage: AggOps.IfNull("$lastMessage", null),
  }),
  Project({
    Id: false,
    Include: {
      id: 1,
      title: 1,
      description: 1,
      type: 1,
      memberCount: 1,
      lastMessage: 1,
      isGroupChat: 1,
      isPrivateChat: 1,
      isSelfChat: 1,
    },
  }),
];

@Injectable()
export class ChatQueryRepo implements IChatQueryRepo {
  constructor(@InjectConnection() private conn: Connection) {}

  private get client() {
    return this.conn.getClient();
  }

  private collection(name: string) {
    return this.client.db("test").collection(name);
  }

  async getChats(
    userId: string,
    options?: GetChatsOptions
  ): Promise<ChatResponseDto[]> {
    const chats = await this.collection("dbusers")
      .aggregate(
        [
          Match(Expr(AggOps.Eq("$_id", userId))),
          Unwind("$chats"),
          ReplaceRoot("$chats"),
          Project({
            Fields: {
              id: "$chatId",
              isMyFave: "$isFave",
            },
            Include: {
              isArchived: 1,
            },
          }),
          Match(options?.byIds ? Expr(AggOps.In("$id", options.byIds)) : {}),
          Match(
            !isNil(options?.fave)
              ? Expr(AggOps.Eq("$isMyFave", options.fave))
              : {}
          ),
          Match(
            !isNil(options?.archived)
              ? Expr(AggOps.Eq("$isArchived", options.archived))
              : {}
          ),
          Lookup(
            "dbchats",
            {
              chatId: "$id",
            },
            [
              Match(Expr(AggOps.Eq("$_id", "$$chatId"))),
              ...ChatGeneralPipelines(),
            ],
            "__chatDetail"
          ),
          Unwind("$__chatDetail", true),
          ReplaceRoot(AggOps.MergeObjects([ROOT, "$__chatDetail"])),
          Unset("__chatDetail"),
          Limit(options?.limit ?? 100),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return chats as ChatResponseDto[];
  }

  async getMessages(
    userId: string,
    chatId: string,
    options?: GetMessagesOptions
  ) {
    const { byIds, byTimeEndpoint, byIdEndpoint, limit } = options || {};

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
          ReplaceRoot("$__messages"),
        ];
      }
    };

    const messages = await this.collection("dbchatmembers")
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

              ...MessageGeneralPipelines(),
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

  async getMembers(
    userId: string,
    chatId: string,
    options?: GetMembersOptions
  ) {
    const { byIds } = options;

    const members = await this.collection("dbchatmembers")
      .aggregate(
        [
          Match(Expr(AggOps.Eq("$chatId", chatId))),
          byIds ? Match(Expr(AggOps.In("$_id", byIds))) : null,
          ...ChatMemberGeneralPipelines(),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return members as ChatMemberResponseDto[];
  }

  async getPhotos(chatId: string, options?: GetPhotosOptions) {
    const { byIds } = options;

    const photos = await this.collection("dbphotos")
      .aggregate(
        [
          Match(
            Expr(
              AggOps.And([
                AggOps.Eq("$chatId", chatId),
                AggOps.In("$_id", byIds),
              ])
            )
          ),
          Lookup(
            "dbfiles",
            {
              fileId: "$original.fileId",
            },
            [
              Match(Expr(AggOps.Eq("$_id", "$$fileId"))),
              Project({
                Id: false,
                Include: {
                  name: 1,
                  size: 1,
                  date: 1,
                  mimetype: 1,
                },
                Fields: {
                  id: "$_id",
                },
              }),
            ],
            "__file"
          ),
          Unwind("$__file"),
          Project({
            Id: false,
            Fields: {
              id: "$_id",
              width: "$original.width",
              height: "$original.height",
              file: "$__file",
            },
          }),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return photos as PhotoResponseDto[];
  }

  async getVideos(chatId: string, options?: GetVideosOptions) {
    const { byIds } = options;

    const videos = await this.collection("dbvideos")
      .aggregate(
        [
          Match(
            Expr(
              AggOps.And([
                AggOps.Eq("$chatId", chatId),
                AggOps.In("$_id", byIds),
              ])
            )
          ),
          Lookup(
            "dbfiles",
            {
              fileId: "$fileId",
            },
            [
              Match(Expr(AggOps.Eq("$_id", "$$fileId"))),
              Project({
                Id: false,
                Include: {
                  name: 1,
                  size: 1,
                  date: 1,
                  mimetype: 1,
                },
                Fields: {
                  id: "$_id",
                },
              }),
            ],
            "__file"
          ),
          Unwind("$__file"),
          Project({
            Id: false,
            Include: {
              width: 1,
              height: 1,
              duration: 1,
            },
            Fields: {
              id: "$_id",
              file: "$__file",
            },
          }),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return videos as VideoResponseDto[];
  }

  async getDocuments(chatId: string, options?: GetDocumentsOptions) {
    const { byIds } = options;

    const videos = await this.collection("dbdocuments")
      .aggregate(
        [
          Match(
            Expr(
              AggOps.And([
                AggOps.Eq("$chatId", chatId),
                AggOps.In("$_id", byIds),
              ])
            )
          ),
          Lookup(
            "dbfiles",
            {
              fileId: "$fileId",
            },
            [
              Match(Expr(AggOps.Eq("$_id", "$$fileId"))),
              Project({
                Id: false,
                Include: {
                  name: 1,
                  size: 1,
                  date: 1,
                  mimetype: 1,
                },
                Fields: {
                  id: "$_id",
                },
              }),
            ],
            "__file"
          ),
          Unwind("$__file"),
          Project({
            Id: false,
            Fields: {
              id: "$_id",
              file: "$__file",
            },
          }),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return videos as VideoResponseDto[];
  }

  async getUsers(options?: GetUsersOptions) {
    const { limit, byIds, byEmails, byNames } = options || {};

    console.log(
      AggOps.Or([
        ...(byEmails
          ? byEmails.map((email) =>
              AggOps.RegexMatch("$emailAddress", `(?i).*${email}.*`)
            )
          : []),
      ])
    );

    const users = await this.collection("dbusers")
      .aggregate(
        [
          // byIds ? Match(AggOps.In("$_id", byIds)) : null,
          // byEmails ? Match(AggOps.In("$emailAddress", byEmails)) : null,
          // byNames ? Match(AggOps.In("$name", byEmails)) : null,

          Match(
            Expr(
              AggOps.Or([
                ...(byEmails
                  ? byEmails.map((email) =>
                      AggOps.RegexMatch("$emailAddress", `(?i).*${email}.*`)
                    )
                  : []),
              ])
            )
          ),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return users as UserResponseDto[];
  }
}
