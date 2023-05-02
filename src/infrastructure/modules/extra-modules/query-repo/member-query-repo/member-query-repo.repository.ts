import { Injectable } from "@nestjs/common";
import { MongoUtils } from "../mongo-utils";
import {
  IMemberQueryRepo,
  QueryMembersOptions,
} from "@application/query-repo/member-query.repo.interface";
import { AggOps, Expr, Lookup, Match, Project, Set } from "../common";
import { MemberStatusLeft } from "@domain/models/member/member-status/member-status-left";
import { MemberStatusBanned } from "@domain/models/member/member-status/member-status-banned";
import { MemberQueryModel } from "@application/query-repo/query-model";
import { isNil } from "lodash";

export const MemberGeneralPipelines = [
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
];

@Injectable()
export class MemberQueryRepo implements IMemberQueryRepo {
  constructor(private mongoUtils: MongoUtils) {}

  async queryMembers(options?: QueryMembersOptions) {
    const { chatId, byIds } = options;

    const members = await this.mongoUtils
      .getCollection("dbmembers")
      .aggregate(
        [
          Match(Expr(AggOps.Eq("$chatId", chatId))),
          byIds ? Match(Expr(AggOps.In("$_id", byIds))) : null,
          ...MemberGeneralPipelines,
        ].filter((stage) => !isNil(stage))
      )
      .toArray();

    return members as MemberQueryModel[];
  }
}
