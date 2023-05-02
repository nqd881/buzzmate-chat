import { MemberId } from "@domain/models/member/member";
import { ChatId } from "@domain/models/chat/chat";
import { DocumentId } from "@domain/models/document/document";
import { Message, MessageId } from "@domain/models/message/message";
import { MessageContent } from "@domain/models/message/message-content";
import { MessageContentMedia } from "@domain/models/message/message-content/media.content";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageForwardInfo } from "@domain/models/message/message-forward-info";
import { MessageReaction } from "@domain/models/message/message-reaction";
import { PhotoId } from "@domain/models/photo/photo";
import { UserId } from "@domain/models/user/user";
import { VideoId } from "@domain/models/video/video";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import {
  DbMessage,
  DbMessageContent,
  DbMessageContentMedia,
  DbMessageContentText,
  DbMessageForwardInfo,
  DbMessageReaction,
} from "./message.schema";

@Injectable()
export class MessageMapper
  implements IDomainPersistenceMapper<Message<any>, DbMessage>
{
  private forwardInfoToPersistence(
    forwardInfo: MessageForwardInfo
  ): DbMessageForwardInfo {
    if (!forwardInfo) return null;

    const { fromChatId, fromMessageId, senderUserId } = forwardInfo;

    return {
      fromChatId: fromChatId.value,
      fromMessageId: fromMessageId.value,
      senderUserId: senderUserId.value,
    };
  }

  private forwardInfoToDomain(
    forwardInfo: DbMessageForwardInfo
  ): MessageForwardInfo {
    if (!forwardInfo) return null;

    const { fromChatId, fromMessageId, senderUserId } = forwardInfo;

    return new MessageForwardInfo({
      fromChatId: new ChatId(fromChatId),
      fromMessageId: new MessageId(fromMessageId),
      senderUserId: new UserId(senderUserId),
    });
  }

  private contentToPersistence(
    contentType: string,
    content: MessageContent<any>
  ): DbMessageContent {
    if (!content) return null;

    switch (content.constructor.name) {
      case MessageContentText.name: {
        const { text, webPage } = content as MessageContentText;

        return {
          contentType,
          text,
        } as DbMessageContentText;
      }
      case MessageContentMedia.name: {
        const { caption, photoIds, videoIds, documentIds } =
          content as MessageContentMedia;

        return {
          contentType,
          caption,
          photoIds: photoIds.map((photoId) => photoId.value),
          videoIds: videoIds.map((videoId) => videoId.value),
          documentIds: documentIds.map((documentId) => documentId.value),
        } as DbMessageContent;
      }
    }
  }

  private contentToDomain(content: DbMessageContent): MessageContent<unknown> {
    if (!content) return null;

    switch (content.contentType) {
      case MessageContentText.name: {
        const { text } = content as DbMessageContentText;

        return new MessageContentText({
          text,
          webPage: null,
        });
      }

      case MessageContentMedia.name: {
        const { caption, photoIds, videoIds, documentIds } =
          content as DbMessageContentMedia;

        return new MessageContentMedia({
          caption,
          photoIds: photoIds.map((photoId) => new PhotoId(photoId)),
          videoIds: videoIds.map((videoId) => new VideoId(videoId)),
          documentIds: documentIds.map(
            (documentId) => new DocumentId(documentId)
          ),
        });
      }
    }
  }

  private reactionToPersistence(
    messageReaction: MessageReaction
  ): DbMessageReaction {
    const { memberId, reactionValue } = messageReaction;

    return {
      memberId: memberId.value,
      reactionValue,
    };
  }

  private reactionToDomain(
    messageReaction: DbMessageReaction
  ): MessageReaction {
    const { memberId, reactionValue } = messageReaction;

    return new MessageReaction({
      memberId: new MemberId(memberId),
      reactionValue,
    });
  }

  toPersistence(entity: Message<any>): DbMessage {
    if (!entity) return null;

    const {
      id,
      chatId,
      senderUserId,
      isPinned,
      isHidden,
      date,
      editDate,
      contentType,
      content,
      replyToMessageId,
      forwardInfo,
      reactions,
      version,
    } = entity;

    return {
      _id: id.value,
      chatId: chatId.value,
      senderUserId: senderUserId.value,
      isPinned,
      isHidden,
      date,
      editDate,
      replyToMessageId: replyToMessageId ? replyToMessageId.value : null,
      forwardInfo: this.forwardInfoToPersistence(forwardInfo),
      content: this.contentToPersistence(contentType, content),
      reactions: reactions.map((reaction) =>
        this.reactionToPersistence(reaction)
      ),
      __version: version,
    };
  }

  toDomain(dbModel: DbMessage): Message<any> {
    if (!dbModel) return null;

    const {
      _id,
      chatId,
      senderUserId,
      isPinned,
      isHidden,
      date,
      editDate,
      content,
      replyToMessageId,
      forwardInfo,
      reactions,
      __version,
    } = dbModel;

    return new Message(
      {
        chatId: new ChatId(chatId),
        senderUserId: new MemberId(senderUserId),
        isPinned,
        isHidden,
        date,
        editDate,
        content: this.contentToDomain(content),
        replyToMessageId: replyToMessageId
          ? new MessageId(replyToMessageId)
          : null,
        forwardInfo: this.forwardInfoToDomain(forwardInfo),
        reactions: reactions.map((reaction) => this.reactionToDomain(reaction)),
      },
      __version,
      new MessageId(_id)
    );
  }
}
