import {
  QueryChatsOptions,
  IChatQueryRepo,
} from "@application/query-repo/chat-query-repo.interface";
import { ChatQueryModel } from "@application/query-repo/query-model";
import { ChatTypes } from "@domain/models/chat/chat";
import { Injectable } from "@nestjs/common";
import { isNil } from "lodash";
import {
  Expr,
  Limit,
  Lookup,
  Match,
  Project,
  ROOT,
  ReplaceRoot,
  Set,
  Unset,
  Unwind,
} from "../common";
import AggOps from "../common/aggregation-pipeline.operators";
import { MongoUtils } from "../mongo-utils";
import { MessageGeneralPipelines } from "../message-query-repo/message-query-repo.repository";

export const ChatGeneralPipelines = (chatId: string) => [
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
      ...MessageGeneralPipelines(chatId),
    ],
    "__lastMessage"
  ),
  Unwind("$__lastMessage", true),
  Set({
    lastMessage: AggOps.IfNull("$__lastMessage", null),
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
  constructor(private mongoUtils: MongoUtils) {}

  async queryChats(
    userId: string,
    options?: QueryChatsOptions
  ): Promise<ChatQueryModel[]> {
    const chats = await this.mongoUtils
      .getCollection("dbusers")
      .aggregate(
        [
          Match(Expr(AggOps.Eq("$_id", userId))),
          Unwind("$chats"),
          ReplaceRoot("$chats"),
          Project({
            Fields: {
              id: "$chatId",
            },
            Include: {
              isFave: 1,
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
              ...ChatGeneralPipelines("$$chatId"),
            ],
            "__chatDetail"
          ),
          Unwind("$__chatDetail"),
          ReplaceRoot(AggOps.MergeObjects([ROOT, "$__chatDetail"])),
          Unset("__chatDetail"),
          Project({
            Include: {
              id: 1,
              title: 1,
              description: 1,
              isGroupChat: 1,
              isPrivateChat: 1,
              isSelfChat: 1,
              lastMessage: 1,
              memberCount: 1,
              isFave: 1,
              isArchived: 1,
            },
          }),
          !options?.returnPersonal
            ? Project({
                Exclude: {
                  isFave: 0,
                  isArchived: 0,
                },
              })
            : null,
          Limit(options?.limit ?? 100),
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return chats as ChatQueryModel[];
  }
}
