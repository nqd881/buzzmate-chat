import {ChatId} from "@domain/models/chat/chat";
import {User, UserId, UserTypes} from "@domain/models/user/user";
import {UserChat} from "@domain/models/user/user-chat";
import {UserPrivacy, UserScopes} from "@domain/models/user/user-privacy";
import {IDomainPersistenceMapper} from "@libs/ddd/domain-persistence-mapper";
import {Injectable} from "@nestjs/common";
import {DbUser, DbUserChat, DbUserPrivacy} from "./user.schema";

@Injectable()
export class UserMapper implements IDomainPersistenceMapper<User, DbUser> {
  private privacyToPersistence(privacy: UserPrivacy): DbUserPrivacy {
    const {canBeAddedBy} = privacy || {};

    return {
      canBeAddedBy,
    };
  }

  private privacyToDomain(privacy: DbUserPrivacy): UserPrivacy {
    const {canBeAddedBy} = privacy || {};

    return new UserPrivacy({canBeAddedBy: canBeAddedBy as UserScopes});
  }

  private userChatToPersistence(userChat: UserChat): DbUserChat {
    const {chatId, isFave, isArchived} = userChat;

    return {
      chatId: chatId.value,
      isFave,
      isArchived,
    };
  }

  private userChatToDomain(userChat: DbUserChat): UserChat {
    const {chatId, isFave, isArchived} = userChat;

    return new UserChat({
      chatId: new ChatId(chatId),
      isFave,
      isArchived,
    });
  }

  toPersistence(entity: User): DbUser {
    if (!entity) return null;

    const {id, identity, name, emailAddress, type, chats, privacy, version} =
      entity;

    return {
      _id: id.value,
      identity,
      emailAddress,
      name,
      type,
      chats: chats.map((chat) => this.userChatToPersistence(chat)),
      privacy: this.privacyToPersistence(privacy),
      __version: version,
    };
  }

  toDomain(dbModel: DbUser): User {
    if (!dbModel) return null;

    const {_id, identity, emailAddress, name, type, chats, privacy, __version} =
      dbModel;

    return new User(
      {
        identity,
        emailAddress,
        name,
        type: type as UserTypes,
        chats: chats.map((chat) => this.userChatToDomain(chat)),
        privacy: this.privacyToDomain(privacy),
      },
      __version,
      new UserId(_id)
    );
  }
}
