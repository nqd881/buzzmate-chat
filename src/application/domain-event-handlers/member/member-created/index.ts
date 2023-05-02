import { UpdateMemberCount } from "./update-chat-member-count";
import { UpdateUserChats } from "./update-user-chats";

export const MemberCreatedDomainEventHandlers = [
  UpdateMemberCount,
  UpdateUserChats,
];
