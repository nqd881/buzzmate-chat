import { Module } from "@nestjs/common";
import { ChatAdminRepoModule } from "./chat-admin/chat-admin-repo.module";
import { ChatMemberRepoModule } from "./chat-member/chat-member-repo.module";
import { ChatOwnerRepoModule } from "./chat-owner/chat-owner-repo.module";
import { ChatRepoModule } from "./chat/chat-repo.module";
import { DocumentRepoModule } from "./document/document-repo.module";
import { FileRepoModule } from "./file/file-repo.module";
import { MessageRepoModule } from "./message/message-repo.module";
import { PhotoRepoModule } from "./photo/photo-repo.module";
import { UserRepoModule } from "./user/user-repo.module";
import { VideoRepoModule } from "./video/video-repo.module";
import { ChatInvitationRepoModule } from "./chat-invitation/chat-invitation-repo.module";

@Module({
  imports: [
    ChatRepoModule,
    ChatMemberRepoModule,
    ChatAdminRepoModule,
    ChatOwnerRepoModule,
    ChatInvitationRepoModule,
    MessageRepoModule,
    UserRepoModule,
    FileRepoModule,
    PhotoRepoModule,
    DocumentRepoModule,
    VideoRepoModule,
  ],
  exports: [
    ChatRepoModule,
    ChatMemberRepoModule,
    ChatAdminRepoModule,
    ChatOwnerRepoModule,
    ChatInvitationRepoModule,
    MessageRepoModule,
    UserRepoModule,
    FileRepoModule,
    PhotoRepoModule,
    DocumentRepoModule,
    VideoRepoModule,
  ],
})
export class RepoRegistryModule {}
