import { Repositories } from "@application/di-tokens/repositories";
import { Ports } from "@application/ports/constants";
import { IFileStorageService } from "@application/ports/interface/file-storage";
import { IChatMemberRepo } from "@domain/models/chat-member/chat-member-repo.interface";
import { ChatId } from "@domain/models/chat/chat";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { Document } from "@domain/models/document/document";
import { IDocumentRepo } from "@domain/models/document/document-repo.interface";
import { File, IFileProps } from "@domain/models/file/file";
import { IFileRepo } from "@domain/models/file/file-repo.interface";
import {
  IMessageProps,
  Message,
  MessageId,
} from "@domain/models/message/message";
import { MessageContentAlbum } from "@domain/models/message/message-content/album.content";
import { MessageContentDocument } from "@domain/models/message/message-content/document.content";
import { MessageContentPhoto } from "@domain/models/message/message-content/photo.content";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageContentVideo } from "@domain/models/message/message-content/video.content";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { Photo } from "@domain/models/photo/photo";
import { IPhotoRepo } from "@domain/models/photo/photo-repo.interface";
import { PhotoSize } from "@domain/models/photo/photo-size";
import { UserId } from "@domain/models/user/user";
import { Video } from "@domain/models/video/video";
import { IVideoRepo } from "@domain/models/video/video-repo.interface";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendMessageCommand } from "./send-message.command";

@CommandHandler(SendMessageCommand)
export class SendMessageService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Chat) private chatRepo: IChatRepo,
    @Inject(Repositories.Message) private messageRepo: IMessageRepo,
    @Inject(Repositories.ChatMember) private chatMemberRepo: IChatMemberRepo,
    @Inject(Repositories.File) private fileRepo: IFileRepo,
    @Inject(Repositories.Photo) private photoRepo: IPhotoRepo,
    @Inject(Repositories.Video) private videoRepo: IVideoRepo,
    @Inject(Repositories.Document) private documentRepo: IDocumentRepo,

    @Inject(Ports.FileStorageService)
    private readonly fileStorageService: IFileStorageService
  ) {}

  private createFile = (prependToSave: any[], fileProps: IFileProps) => {
    const newFile = File.create(fileProps);

    prependToSave.push(async () => this.fileRepo.save(newFile));

    return newFile;
  };

  private createPhoto(prependToSave: any[], file: File, chatId: ChatId) {
    const newPhoto = Photo.create({
      chatId,
      original: new PhotoSize({
        width: null,
        height: null,
        fileId: file.id,
      }),
      variants: null,
    });

    prependToSave.push(async () => this.photoRepo.save(newPhoto));

    return newPhoto;
  }

  private createVideo(prependToSave: any[], file: File, chatId: ChatId) {
    const newVideo = Video.create({
      chatId,
      width: null,
      height: null,
      duration: null,
      thumbnail: null,
      fileId: file.id,
    });

    prependToSave.push(async () => this.videoRepo.save(newVideo));

    return newVideo;
  }

  private createDocument(prependToSave: any[], file: File, chatId: ChatId) {
    const newDocument = Document.create({
      chatId,
      fileId: file.id,
    });

    prependToSave.push(async () => this.documentRepo.save(newDocument));

    return newDocument;
  }

  private getFileType(file: File) {
    return file.mimetype.split("/")[0];
  }

  private buildContentWithoutFile(message: string) {
    return new MessageContentText({
      text: message,
      webPage: null,
    });
  }

  private buildContentWithSingleFile(
    prependToSave: any[],
    chatId: ChatId,
    message: string,
    file: File
  ) {
    switch (this.getFileType(file)) {
      case "image": {
        const newPhoto = this.createPhoto(prependToSave, file, chatId);

        return new MessageContentPhoto({
          caption: message,
          photoId: newPhoto.id,
        });
      }
      case "video": {
        const newVideo = this.createVideo(prependToSave, file, chatId);

        return new MessageContentVideo({
          caption: message,
          videoId: newVideo.id,
        });
      }
      default: {
        const newDocument = this.createDocument(prependToSave, file, chatId);

        return new MessageContentDocument({
          caption: message,
          documentId: newDocument.id,
        });
      }
    }
  }

  private buildContentWithMultiFiles(
    prependToSave: any[],
    chatId: ChatId,
    message: string,
    files: File[]
  ) {
    const photoIds = [],
      videoIds = [],
      documentIds = [];

    files.forEach((file) => {
      switch (this.getFileType(file)) {
        case "image": {
          const newPhoto = this.createPhoto(prependToSave, file, chatId);

          photoIds.push(newPhoto.id);

          break;
        }
        case "video": {
          const newVideo = this.createVideo(prependToSave, file, chatId);

          videoIds.push(newVideo.id);

          break;
        }
        default: {
          const newDocument = this.createDocument(prependToSave, file, chatId);

          documentIds.push(newDocument.id);

          break;
        }
      }
    });

    return new MessageContentAlbum({
      caption: message,
      photoIds,
      videoIds,
      documentIds,
    });
  }

  private buildContent(
    prependToSave: any[],
    chatId: ChatId,
    message: string,
    files: File[]
  ) {
    switch (files.length) {
      case 0: {
        return this.buildContentWithoutFile(message);
      }
      case 1: {
        return this.buildContentWithSingleFile(
          prependToSave,
          chatId,
          message,
          files[0]
        );
      }
      default: {
        return this.buildContentWithMultiFiles(
          prependToSave,
          chatId,
          message,
          files
        );
      }
    }
  }

  async execute(command: SendMessageCommand) {
    const prepareMessageId = new MessageId(command?.prepareMessageId);
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const replyToMessageId = command.replyToMessageId
      ? new MessageId(command.replyToMessageId)
      : null;
    const message = command.message;
    const files = command.files;

    const prependToSave: (() => Promise<unknown>)[] = [];

    const chat = await this.chatRepo.findOneById(chatId);

    if (!chat) throw new Error("Chat not found");

    const newFiles = files.map(({ name, mimetype, size }) =>
      this.createFile(prependToSave, {
        name,
        mimetype,
        size,
        date: new Date(),
        url: null,
      })
    );

    const content = this.buildContent(prependToSave, chatId, message, newFiles);

    const messageProps: IMessageProps<typeof content> = {
      chatId: chatId,
      senderUserId: userId,
      content,
      isPinned: false,
      isHidden: false,
      date: new Date(),
      editDate: null,
      replyToMessageId,
      forwardInfo: null,
      reactions: [],
    };

    const chatMember = await this.chatMemberRepo.findOneInChatByUserId(
      chatId,
      userId
    );

    if (!chatMember) throw new Error("Chat member not found");

    const newMessage = Message.create(messageProps, prepareMessageId);

    await Promise.all(prependToSave.map((promiseBuilder) => promiseBuilder()));

    newFiles.forEach((newFile, index) => {
      this.fileStorageService.saveChatFile(
        chatId,
        newFile,
        files[index].content
      );
    });

    await this.messageRepo.save(newMessage);

    return newMessage;
  }
}
