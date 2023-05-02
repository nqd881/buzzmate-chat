import { ChatId } from "@domain/models/chat/chat";
import { UserId } from "@domain/models/user/user";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbInvitation } from "./chat-invitation.schema";
import {
  Invitation,
  InvitationId,
  InvitationResponse,
} from "@domain/models/invitation/invitation";

@Injectable()
export class InvitationMapper
  implements IDomainPersistenceMapper<Invitation, DbInvitation>
{
  toPersistence(entity: Invitation): DbInvitation {
    if (!entity) return null;

    const {
      id,
      chatId,
      inviterUserId,
      invitedUserId,
      expiredAt,
      response,
      version,
    } = entity;

    return {
      _id: id.value,
      chatId: chatId.value,
      inviterUserId: inviterUserId.value,
      invitedUserId: invitedUserId.value,
      expiredAt,
      response,
      __version: version,
    };
  }

  toDomain(dbModel: DbInvitation): Invitation {
    if (!dbModel) return null;

    const {
      _id,
      chatId,
      inviterUserId,
      invitedUserId,
      expiredAt,
      response,
      __version,
    } = dbModel;

    return new Invitation(
      {
        chatId: new ChatId(chatId),
        inviterUserId: new UserId(inviterUserId),
        invitedUserId: new UserId(invitedUserId),
        expiredAt,
        response: response as InvitationResponse,
      },
      __version,
      new InvitationId(_id)
    );
  }
}
