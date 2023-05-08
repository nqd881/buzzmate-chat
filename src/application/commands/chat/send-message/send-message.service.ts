import { Repositories } from "@application/di-tokens/repositories";
import { Ports } from "@application/ports/constants";
import { IFileStorageService } from "@application/ports/interface/file-storage";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
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
import { MessageContentMedia } from "@domain/models/message/message-content/media.content";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { Photo } from "@domain/models/photo/photo";
import { IPhotoRepo } from "@domain/models/photo/photo-repo.interface";
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
    @Inject(Repositories.Member) private memberRepo: IMemberRepo,
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
      width: null,
      height: null,
      fileId: file.id,
    });

    prependToSave.push(async () => this.photoRepo.save(newPhoto));

    return newPhoto;
  }

  private createVideo(prependToSave: any[], file: File, chatId: ChatId) {
    const newVideo = Video.create({
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

  private buildContentWithFiles(
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

    return new MessageContentMedia({
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
      default: {
        return this.buildContentWithFiles(
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

    const member = await this.memberRepo.findOneInChatByUserId(chatId, userId);

    if (!member) throw new Error("Member not found");

    const newMessage = Message.create(messageProps, prepareMessageId);

    await Promise.all(prependToSave.map((promiseBuilder) => promiseBuilder()));

    await Promise.all(
      newFiles.map((newFile, index) =>
        this.fileStorageService.saveChatFile(
          chatId,
          newFile,
          files[index].content
        )
      )
    );

    await this.messageRepo.save(newMessage);

    return newMessage;
  }
}
