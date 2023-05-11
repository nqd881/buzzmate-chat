import { ChatTypes } from "@domain/models/chat/chat";
import {
  AggOps,
  Expr,
  Lookup,
  Match,
  Project,
  Set,
  Unwind,
} from "../shared/common";
import { MessageBasePipeline } from "../message-query-repo/pipelines";

export const ChatBasePipeline = [
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
    [Match(Expr(AggOps.Eq("$_id", "$$lastMessageId"))), ...MessageBasePipeline],
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
