import { Module } from "@nestjs/common";
import { ChatQueryRepoModule } from "./chat-query-repo/chat-query-repo.module";
import { MemberQueryRepoModule } from "./member-query-repo/member-query-repo.module";
import { MessageQueryRepoModule } from "./message-query-repo/message-query-repo.module";
import { FileQueryRepoModule } from "./file-query-repo/file-query-repo.module";
import { PhotoQueryRepoModule } from "./photo-query-repo/photo-query-repo.module";
import { VideoQueryRepoModule } from "./video-query-repo/video-query-repo.module";
import { DocumentQueryRepoModule } from "./document-query-repo/document-query-repo.module";
import { UserQueryRepoModule } from "./user-query-repo/user-query-repo.module";

const queryRepoModules = [
  UserQueryRepoModule,
  ChatQueryRepoModule,
  MemberQueryRepoModule,
  MessageQueryRepoModule,
  FileQueryRepoModule,
  PhotoQueryRepoModule,
  VideoQueryRepoModule,
  DocumentQueryRepoModule,
];

@Module({
  imports: [...queryRepoModules],
  exports: [...queryRepoModules],
})
export class QueryRepoModule {}
