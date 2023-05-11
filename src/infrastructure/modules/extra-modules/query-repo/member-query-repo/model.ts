import { IMemberQueryModel } from "@application/query-repo/query-model";

export class MemberQueryModel implements IMemberQueryModel {
  id: string;

  chatId: string;

  userId: string;

  name: string;

  nickname: string;

  inviterUserId: string;

  joinedDate: number;

  isBanned: boolean;

  hasLeft: boolean;

  leaveDate?: number;

  bannedDate?: number;

  isAdmin?: boolean;

  isOwner?: boolean;
}
