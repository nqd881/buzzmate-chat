import { IChatQueryModel } from "@application/query-repo/query-model";
import { MessageQueryModel } from "../message-query-repo/model";
import { Type } from "class-transformer";

export class ChatQueryModel implements IChatQueryModel {
  id: string;

  title: string;

  description: string;

  isGroupChat: boolean;

  isPrivateChat: boolean;

  isSelfChat: boolean;

  @Type(() => MessageQueryModel)
  lastMessage: MessageQueryModel;

  memberCount: number;

  isFave?: boolean;

  isArchived?: boolean;
}
