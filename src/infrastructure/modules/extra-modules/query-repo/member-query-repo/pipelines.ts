import { MemberStatusLeft } from "@domain/models/member/member-status/member-status-left";
import { AggOps, Expr, Lookup, Match, Project, Set } from "../shared/common";
import { MemberStatusBanned } from "@domain/models/member/member-status/member-status-banned";

export const MemberBasePipeline = [
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
