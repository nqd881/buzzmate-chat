import { Audio } from "@domain/models/audio";
import { ChatId } from "@domain/models/chat/chat";
import { Document } from "@domain/models/document";
import { File } from "@domain/models/file";
import { MemberId } from "@domain/models/member/member";
import { Message, MessageId } from "@domain/models/message/message";
import { MessageContentAudio } from "@domain/models/message/message-content/audio.content";
import { MessageContentDocument } from "@domain/models/message/message-content/document.content";
import { MessageContent } from "@domain/models/message/message-content/interface/message-content";
import { MessageContentPhoto } from "@domain/models/message/message-content/photo.content";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageContentVideo } from "@domain/models/message/message-content/video.content";
import { MessageForwardInfo } from "@domain/models/message/message-forward-info";
import { MessageReaction } from "@domain/models/message/message-reaction";
import { Photo } from "@domain/models/photo";
import { UserId } from "@domain/models/user/user";
import { Video } from "@domain/models/video";
import { IDomainPersistenceMapper } from "@libs/ddd";
import { Injectable } from "@nestjs/common";
import { DbAudio } from "../audio.schema";
import { DbDocument } from "../document.schema";
import { DbFile } from "../file.schema";
import { DbPhoto } from "../photo.schema";
import { DbVideo } from "../video.schema";
import {
  DbMessage,
  DbMessageContent,
  DbMessageContentAudio,
  DbMessageContentDocument,
  DbMessageContentPhoto,
  DbMessageContentText,
  DbMessageContentVideo,
  DbMessageForwardInfo,
  DbMessageReaction,
} from "./schemas/message.schema";

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

  private fileToDomain(file: DbFile): File {
    if (!file) return null;

    const { name, size, mimetype } = file;

    return new File({
      name,
      size,
      mimetype,
    });
  }

  private fileToPersistence(file: File): DbFile {
    if (!file) return null;

    const { name, size, mimetype } = file;

    return {
      name,
      size,
      mimetype,
    };
  }

  private photoToPersistence(photo: Photo): DbPhoto {
    if (!photo) return null;

    const { width, height, file } = photo;

    return {
      width,
      height,
      file: this.fileToPersistence(file),
    };
  }

  private photoToDomain(photo: DbPhoto): Photo {
    if (!photo) return null;

    const { width, height, file } = photo;

    return new Photo({
      width,
      height,
      file: this.fileToDomain(file),
    });
  }

  private videoToPersistence(video: Video): DbVideo {
    if (!video) return null;

    const { width, height, duration, thumbnail, file } = video;

    return {
      width,
      height,
      duration,
      thumbnail: this.photoToPersistence(thumbnail),
      file: this.fileToPersistence(file),
    };
  }

  private videoToDomain(video: DbVideo): Video {
    if (!video) return null;

    const { width, height, duration, thumbnail, file } = video;

    return new Video({
      width,
      height,
      duration,
      thumbnail: this.photoToDomain(thumbnail),
      file: this.fileToDomain(file),
    });
  }

  private audioToPersistence(audio: Audio): DbAudio {
    if (!audio) return null;

    const { title, duration, file } = audio;

    return {
      title,
      duration,
      file: this.fileToPersistence(file),
    };
  }

  private audioToDomain(audio: DbAudio): Audio {
    if (!audio) return null;

    const { title, duration, file } = audio;

    return new Audio({
      title,
      duration,
      file: this.fileToDomain(file),
    });
  }

  private documentToPersistence(document: Document): DbDocument {
    if (!document) return null;

    const { file } = document;

    return {
      file: this.fileToPersistence(file),
    };
  }

  private documentToDomain(document: DbDocument): Document {
    if (!document) return null;

    const { file } = document;

    return new Document({
      file: this.fileToDomain(file),
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

      case MessageContentPhoto.name: {
        const { caption, photo } = content as MessageContentPhoto;

        return {
          contentType,
          caption,
          photo: this.photoToPersistence(photo),
        } as DbMessageContentPhoto;
      }

      case MessageContentVideo.name: {
        const { caption, video } = content as MessageContentVideo;

        return {
          contentType,
          caption,
          video: this.videoToPersistence(video),
        } as DbMessageContentVideo;
      }

      case MessageContentAudio.name: {
        const { caption, audio } = content as MessageContentAudio;

        return {
          contentType,
          caption,
          audio: this.audioToPersistence(audio),
        } as DbMessageContentAudio;
      }

      case MessageContentDocument.name: {
        const { caption, document } = content as MessageContentDocument;

        return {
          contentType,
          caption,
          document: this.documentToPersistence(document),
        } as DbMessageContentDocument;
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

      case MessageContentPhoto.name: {
        const { caption, photo } = content as DbMessageContentPhoto;

        return new MessageContentPhoto({
          caption,
          photo: this.photoToDomain(photo),
        });
      }

      case MessageContentVideo.name: {
        const { caption, video } = content as DbMessageContentVideo;

        return new MessageContentVideo({
          caption,
          video: this.videoToDomain(video),
        });
      }

      case MessageContentAudio.name: {
        const { caption, audio } = content as DbMessageContentAudio;

        return new MessageContentAudio({
          caption,
          audio: this.audioToDomain(audio),
        });
      }

      case MessageContentDocument.name: {
        const { caption, document } = content as DbMessageContentDocument;

        return new MessageContentDocument({
          caption,
          document: this.documentToDomain(document),
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
