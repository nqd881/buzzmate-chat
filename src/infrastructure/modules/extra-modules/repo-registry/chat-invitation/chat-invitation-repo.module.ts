import { DomainPersistenceMappers } from "@application/di-tokens/domain-persistence-mappers";
import { Repositories } from "@application/di-tokens/repositories";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InvitationMapper } from "./chat-invitation.mapper";
import { InvitationRepository } from "./chat-invitation.repository";
import { DbInvitation, DbInvitationSchema } from "./chat-invitation.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DbInvitation.name, schema: DbInvitationSchema },
    ]),
  ],
  providers: [
    {
      provide: Repositories.Invitation,
      useClass: InvitationRepository,
    },
    {
      provide: DomainPersistenceMappers.Invitation,
      useClass: InvitationMapper,
    },
  ],
  exports: [Repositories.Invitation],
})
export class InvitationRepoModule {}
