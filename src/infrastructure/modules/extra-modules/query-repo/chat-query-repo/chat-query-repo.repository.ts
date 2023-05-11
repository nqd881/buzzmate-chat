import {
  IChatQueryRepo,
  QueryChatsOptions,
} from "@application/query-repo/chat-query-repo.interface";
import { IChatQueryModel } from "@application/query-repo/query-model";
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
  Unset,
  Unwind,
} from "../shared/common";
import AggOps from "../shared/common/aggregation-pipeline.operators";
import { MongoUtils } from "../shared/mongo-utils";
import { ChatBasePipeline } from "./pipelines";

@Injectable()
export class ChatQueryRepo implements IChatQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryChats(
    userId: string,
    options?: QueryChatsOptions
  ): Promise<IChatQueryModel[]> {
    const chats = (await this.mongoUtils
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
          Lookup(
            "dbchats",
            {
              chatId: "$chatId",
            },
            [Match(Expr(AggOps.Eq("$_id", "$$chatId"))), ...ChatBasePipeline],
            "__chatDetail"
          ),
          Unwind("$__chatDetail"),
          ReplaceRoot(AggOps.MergeObjects([ROOT, "$__chatDetail"])),
          Unset("__chatDetail"),
          Project({
            Fields: {
              id: "$chatId",
            },
            Include: {
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
      .toArray()) as IChatQueryModel[];

    return chats;
  }
}
