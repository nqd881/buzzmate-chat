import { ChatMemberCreatedSocketListener } from "./member-created";
import { MessageCreatedSocketListener } from "./message-created";

export const SOCKET_DOMAIN_EVENT_LISTENERS = [
  MessageCreatedSocketListener,
  ChatMemberCreatedSocketListener,
];
