import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { Repositories } from "@application/di-tokens/repositories";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MemberMapper } from "./member.mapper";
import { MemberRepository } from "./member.repository";
import { DbMember, DbMemberSchema } from "./member.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbMember.name, schema: DbMemberSchema },
    ]),
  ],
  providers: [
    { provide: Repositories.Member, useClass: MemberRepository },
    { provide: DomainPersistenceMappers.Member, useClass: MemberMapper },
  ],
  exports: [Repositories.Member],
})
export class MemberRepoModule {}
