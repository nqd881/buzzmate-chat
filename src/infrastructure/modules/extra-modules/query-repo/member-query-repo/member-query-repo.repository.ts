import {
  IMemberQueryRepo,
  QueryMembersOptions,
} from "@application/query-repo/member-query.repo.interface";
import { MemberQueryModel } from "@application/query-repo/query-model";
import { MemberStatusBanned } from "@domain/models/member/member-status/member-status-banned";
import { MemberStatusLeft } from "@domain/models/member/member-status/member-status-left";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { isNil } from "lodash";
import { AggOps, Expr, Lookup, Match, Project, Set } from "../shared/common";
import { VIEW_COLLECTION_NAMES } from "../shared/constants";
import { MongoUtils } from "../shared/mongo-utils";

@Injectable()
export class MemberQueryRepo implements IMemberQueryRepo, OnModuleInit {
  constructor(private mongoUtils: MongoUtils) {}

  async onModuleInit() {
    const collectionName = VIEW_COLLECTION_NAMES.MEMBER;

    const isExisting = await this.mongoUtils.collectionIsExisting(
      collectionName
    );

    if (isExisting)
      await this.mongoUtils.getDb().dropCollection(collectionName);

    await this.mongoUtils.getDb().createCollection(collectionName, {
      viewOn: "dbmembers",
      pipeline: [
        Set({
          id: "$_id",
          leaveDate: AggOps.Cond(
            AggOps.Eq("$status.type", MemberStatusLeft.name),
            "$status.leaveDate",
            null
          ),
          bannedDate: AggOps.Cond(
            AggOps.Eq("$status.type", MemberStatusBanned.name),
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
          },
        }),
      ],
    });
  }

  async queryMembers(options?: QueryMembersOptions) {
    const { chatId, byIds } = options;

    const members = await this.mongoUtils
      .getCollection(VIEW_COLLECTION_NAMES.MEMBER)
      .aggregate(
        [
          Match(Expr(AggOps.Eq("$chatId", chatId))),
          byIds ? Match(Expr(AggOps.In("$_id", byIds))) : null,
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return members as MemberQueryModel[];
  }
}
