import {
  IChatQueryRepo,
  QueryChatsOptions,
} from "@application/query-repo/chat-query-repo.interface";
import { ChatQueryModel } from "@application/query-repo/query-model";
import { ChatTypes } from "@domain/models/chat/chat";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { isNil } from "lodash";
import {
  Expr,
  Limit,
  LookupBasic,
  Match,
  Project,
  ROOT,
  ReplaceRoot,
  Set,
  Unset,
  Unwind,
} from "../shared/common";
import AggOps from "../shared/common/aggregation-pipeline.operators";
import { VIEW_COLLECTION_NAMES } from "../shared/constants";
import { MongoUtils } from "../shared/mongo-utils";

@Injectable()
export class ChatQueryRepo implements IChatQueryRepo, OnModuleInit {
  constructor(private mongoUtils: MongoUtils) {}

  async onModuleInit() {
    const collectionName = VIEW_COLLECTION_NAMES.CHAT;

    const isExisting = await this.mongoUtils.collectionIsExisting(
      collectionName
    );

    if (isExisting)
      await this.mongoUtils.getDb().dropCollection(collectionName);

    await this.mongoUtils.getDb().createCollection(collectionName, {
      viewOn: "dbchats",
      pipeline: [
        Set({
          id: "$_id",
          isGroupChat: AggOps.Eq("$type", ChatTypes.GROUP),
          isPrivateChat: AggOps.Eq("$type", ChatTypes.PRIVATE),
          isSelfChat: AggOps.Eq("$type", ChatTypes.SELF),
        }),
        LookupBasic(
          VIEW_COLLECTION_NAMES.MESSAGE,
          "lastMessageId",
          "id",
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
      ],
    });
  }

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
            Include: {
              chatId: 1,
              isFave: 1,
              isArchived: 1,
            },
          }),
          Match(
            options?.byIds ? Expr(AggOps.In("$chatId", options.byIds)) : {}
          ),
          Match(
            !isNil(options?.fave)
              ? Expr(AggOps.Eq("$isFave", options.fave))
              : {}
          ),
          Match(
            !isNil(options?.archived)
              ? Expr(AggOps.Eq("$isArchived", options.archived))
              : {}
          ),
          LookupBasic(
            VIEW_COLLECTION_NAMES.CHAT,
            "chatId",
            "id",
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
