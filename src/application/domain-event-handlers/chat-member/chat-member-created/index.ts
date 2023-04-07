import {UpdateChatMemberCount} from "./update-chat-member-count";
import {UpdateUserChats} from "./update-user-chats";

export const ChatMemberCreatedDomainEventHandlers = [
  UpdateChatMemberCount,
  UpdateUserChats,
];
