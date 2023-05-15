import { Module } from "@nestjs/common";
import { ChatAdminRepoModule } from "./chat-admin/chat-admin-repo.module";
import { InvitationRepoModule } from "./chat-invitation/chat-invitation-repo.module";
import { ChatOwnerRepoModule } from "./chat-owner/chat-owner-repo.module";
import { ChatRepoModule } from "./chat/chat-repo.module";
import { MemberRepoModule } from "./member/member-repo.module";
import { MessageRepoModule } from "./message/message-repo.module";
import { UserRepoModule } from "./user/user-repo.module";

@Module({
  imports: [
    ChatRepoModule,
    MemberRepoModule,
    ChatAdminRepoModule,
    ChatOwnerRepoModule,
    InvitationRepoModule,
    MessageRepoModule,
    UserRepoModule,
  ],
  exports: [
    ChatRepoModule,
    MemberRepoModule,
    ChatAdminRepoModule,
    ChatOwnerRepoModule,
    InvitationRepoModule,
    MessageRepoModule,
    UserRepoModule,
  ],
})
export class RepoRegistryModule {}
