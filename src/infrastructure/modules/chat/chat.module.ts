import { BanMembersService } from "@application/commands/chat/ban-members/ban-members.service";
import { CreateChatService } from "@application/commands/chat/create-chat/create-chat.service";
import { EditChatInfoService } from "@application/commands/chat/edit-chat-info/edit-chat-info.service";
import { HideMessagesService } from "@application/commands/chat/hide-messages/hide-messages.service";
import { InviteToChatService } from "@application/commands/chat/invite-to-chat/invite-to-chat.service";
import { LeaveChatService } from "@application/commands/chat/leave-chat/leave-chat.service";
import { LockChatService } from "@application/commands/chat/lock-chat/lock-chat.service";
import { PinMessagesService } from "@application/commands/chat/pin-messages/pin-messages.service";
import { ReplyToInvitationService } from "@application/commands/chat/reply-to-invitation/reply-to-invitation.service";
import { SendMessageService } from "@application/commands/chat/send-message/send-message.service";
import { SendReactionService } from "@application/commands/chat/send-reaction/send-reaction.service";
import { ChatDomainEventHandlers } from "@application/domain-event-handlers/chat";
import { InvitationDomainEventHandlers } from "@application/domain-event-handlers/invitation";
import { MemberDomainEventHandlers } from "@application/domain-event-handlers/member";
import { MessageDomainEventHandlers } from "@application/domain-event-handlers/message";
import { FindChatsService } from "@application/queries/find-chats/find-chats.service";
import { FindMessagesService } from "@application/queries/find-messages/find-messages.service";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { FileStorageModule } from "../extra-modules/file-storage/file-storage.module";
import { QueryRepoModule } from "../extra-modules/query-repo/query-repo.module";
import { RepoRegistryModule } from "../extra-modules/repo-registry/repo-registry.module";
import { BanMembersController } from "./controllers/ban-members.controller";
import { CreateChatController } from "./controllers/create-chat.controller";
import { EditChatInfoController } from "./controllers/edit-chat-info.controller";
import { ForwardMessageController } from "./controllers/forward-message.controller";
import { GetChatController } from "./controllers/get-chat.controller";
import { GetChatsController } from "./controllers/get-chats.controller";
import { GetChatDocumentController } from "./controllers/get-chat-document.controller";
import { GetMessageController } from "./controllers/get-message.controller";
import { GetMessagesController } from "./controllers/get-messages.controller";
import { GetChatPhotoController } from "./controllers/get-chat-photo.controller";
import { GetChatVideoController } from "./controllers/get-chat-video.controller";
import { HideMessageController } from "./controllers/hide-message.controller";
import { InviteToChatController } from "./controllers/invite-to-chat.controller";
import { LeaveChatController } from "./controllers/leave-chat.controller";
import { LockChatController } from "./controllers/lock-chat.controller";
import { PinMessageController } from "./controllers/pin-message.controller";
import { ReplyToInvitationController } from "./controllers/reply-to-invitation.controller";
import { SendMessageController } from "./controllers/send-message.controller";
import { SendReactionController } from "./controllers/send-reaction.controller";
import { AppGateway } from "./socket-gateways/app-gateway";
import { SendMessageGateway } from "./socket-gateways/send-message.gateway";
import { DomainEventBusModule } from "../extra-modules/domain-event-bus/domain-event-bus.module";
import { JoinChatService } from "@application/commands/chat/join-chat/join-chat.service";
import { JoinChatController } from "./controllers/join-chat.controller";
import { FindChatPhotosService } from "@application/queries/find-chat-photos/find-chat-photos.service";
import { FindChatVideosService } from "@application/queries/find-chat-videos/find-chat-videos.service";
import { GetMembersController } from "./controllers/get-members.controller";
import { FindMembersService } from "@application/queries/find-members/find-members.service";
import { SOCKET_DOMAIN_EVENT_LISTENERS } from "./socket-gateways/domain-event-listener";
import { ForwardMessageService } from "@application/commands/chat/foward-message/forward-message.service";
import { FindChatDocumentsService } from "@application/queries/find-chat-documents/find-chat-documents.service";

const commandHandlers = [
  CreateChatService,
  EditChatInfoService,
  LockChatService,
  JoinChatService,

  SendMessageService,
  PinMessagesService,
  ForwardMessageService,
  SendReactionService,
  HideMessagesService,

  BanMembersService,
  InviteToChatService,

  LeaveChatService,
  ReplyToInvitationService,

  FindMessagesService,
  FindChatsService,
  FindChatPhotosService,
  FindChatVideosService,
  FindChatDocumentsService,
  FindMembersService,
];

const eventHandlers = [
  ...ChatDomainEventHandlers,
  ...MemberDomainEventHandlers,
  ...InvitationDomainEventHandlers,
  ...MessageDomainEventHandlers,
];

const httpControllers = [
  CreateChatController,
  EditChatInfoController,
  LockChatController,
  JoinChatController,

  SendMessageController,
  PinMessageController,
  ForwardMessageController,
  SendReactionController,
  HideMessageController,

  BanMembersController,
  InviteToChatController,

  LeaveChatController,
  ReplyToInvitationController,

  GetChatPhotoController,
  GetChatVideoController,
  GetChatDocumentController,
  GetChatsController,
  GetChatController,
  GetMessagesController,
  GetMessageController,
  GetMembersController,
];

const socketGateways = [
  AppGateway,
  SendMessageGateway,
  ...SOCKET_DOMAIN_EVENT_LISTENERS,
];

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    RepoRegistryModule,
    QueryRepoModule,
    FileStorageModule,
    DomainEventBusModule,
  ],
  controllers: [...httpControllers],
  providers: [...commandHandlers, ...eventHandlers, ...socketGateways],
  exports: [],
})
export class ChatModule {}
