import { Repositories } from "@application/di-tokens/repositories";
import { Ports } from "@application/ports/constants";
import {
  ChatFilePath,
  IFileStorageService,
} from "@application/ports/interface/file-storage";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { ChatId } from "@domain/models/chat/chat";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { Document } from "@domain/models/document/document";
import { IDocumentRepo } from "@domain/models/document/document-repo.interface";
import { File, FileId } from "@domain/models/file/file";
import { IFileRepo } from "@domain/models/file/file-repo.interface";
import { Message, MessageId } from "@domain/models/message/message";
import { MessageContentMedia } from "@domain/models/message/message-content/media.content";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageForwardInfo } from "@domain/models/message/message-forward-info";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { Photo } from "@domain/models/photo/photo";
import { IPhotoRepo } from "@domain/models/photo/photo-repo.interface";
import { UserId } from "@domain/models/user/user";
import { Video } from "@domain/models/video/video";
import { IVideoRepo } from "@domain/models/video/video-repo.interface";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForwardMessageCommand } from "./forward-message.command";

@CommandHandler(ForwardMessageCommand)
export class ForwardMessageService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Photo) private readonly photoRepo: IPhotoRepo,
    @Inject(Repositories.Video) private readonly videoRepo: IVideoRepo,
    @Inject(Repositories.Document) private readonly documentRepo: IDocumentRepo,
    @Inject(Repositories.File) private readonly fileRepo: IFileRepo,

    @Inject(Repositories.Message) private readonly messageRepo: IMessageRepo,
    @Inject(Repositories.Chat) private readonly chatRepo: IChatRepo,
    @Inject(Repositories.Member)
    private readonly memberRepo: IMemberRepo,

    @Inject(Ports.FileStorageService)
    private readonly fileStorageService: IFileStorageService
  ) {}

  async execute(command: ForwardMessageCommand) {
    const userId = new UserId(command.metadata.userId);
    const fromChatId = new ChatId(command.fromChatId);
    const toChatId = new ChatId(command.toChatId);
    const messageId = new MessageId(command.messageId);

    const rootMember = await this.memberRepo.findOneInChatByUserId(
      fromChatId,
      userId
    );

    if (!rootMember) throw new Error("Root chat member not found");

    const [chat, member] = await Promise.all([
      this.chatRepo.findOneById(toChatId),
      this.memberRepo.findOneInChatByUserId(toChatId, userId),
    ]);

    if (!chat) throw new Error("Chat not found");

    if (!member) throw new Error("Member not found");

    const message = await this.messageRepo.findOneById(messageId);

    const photoIds = MessageContentMedia.isMediaContent(message.content)
      ? message.content?.photoIds ?? []
      : [];

    const videoIds = MessageContentMedia.isMediaContent(message.content)
      ? message.content?.videoIds ?? []
      : [];

    const documentIds = MessageContentMedia.isMediaContent(message.content)
      ? message.content?.documentIds ?? []
      : [];

    const [photos, videos, documents] = await Promise.all([
      this.photoRepo.findManyById(photoIds),
      this.videoRepo.findManyById(videoIds),
      this.documentRepo.findManyById(documentIds),
    ]);

    const getPhotoFileIds = (photos: Photo[]) =>
      photos.map((photo) => photo.fileId);

    const getVideoFileIds = (videos: Video[]) =>
      videos.map((video) => video.fileId);

    const getDocumentFileIds = (documents: Document[]) =>
      documents.map((document) => document.fileId);

    const fileIds = [
      ...getPhotoFileIds(photos),
      ...getVideoFileIds(videos),
      ...getDocumentFileIds(documents),
    ];

    const files = await this.fileRepo.findManyById(fileIds);

    const forwardFiles = [];

    const getFile = (fileId: FileId) =>
      files.find((file) => file.id.equals(fileId));

    const filesMap = new Map<string, string>();

    const createForwardFile = (file: File) => {
      const forwardFile = File.create(file.getProps());

      filesMap.set(file.id.value, forwardFile.id.value);

      return forwardFile;
    };

    const forwardPhotos = photos.map((photo) => {
      const photoFileId = photo.fileId;

      const photoFile = getFile(photoFileId);

      const newForwardFile = createForwardFile(photoFile);

      forwardFiles.push(newForwardFile);

      const photoProps = photo.getProps();

      return Photo.create({
        ...photoProps,
        fileId: newForwardFile.id,
      });
    });

    const forwardVideos = videos.map((video) => {
      const videoFileId = video.fileId;

      const videoFile = getFile(videoFileId);

      const newForwardFile = createForwardFile(videoFile);

      forwardFiles.push(newForwardFile);

      const videoProps = video.getProps();

      return Video.create({
        ...videoProps,
        fileId: newForwardFile.id,
      });
    });

    const forwardDocuments = documents.map((document) => {
      const documentFileId = document.fileId;

      const documentFile = getFile(documentFileId);

      const newForwardFile = createForwardFile(documentFile);

      forwardFiles.push(newForwardFile);

      const documentProps = document.getProps();

      return Document.create({
        ...documentProps,
        fileId: newForwardFile.id,
      });
    });

    const content = (() => {
      const messageContent = message.content;

      switch (true) {
        case MessageContentText.isTextContent(messageContent): {
          return new MessageContentText(messageContent.clone());
        }
        case MessageContentMedia.isMediaContent(messageContent): {
          return new MessageContentMedia(
            messageContent.cloneWith({
              photoIds: forwardPhotos.map((photo) => photo.id),
              videoIds: forwardVideos.map((video) => video.id),
              documentIds: forwardDocuments.map((document) => document.id),
            })
          );
        }
      }
    })();

    const newMessage = Message.create({
      chatId: chat.id,
      senderUserId: member.userId,
      content,
      isPinned: false,
      isHidden: false,
      date: new Date(),
      editDate: null,
      replyToMessageId: null,
      forwardInfo: new MessageForwardInfo({
        fromChatId: message.chatId,
        fromMessageId: message.id,
        senderUserId: message.senderUserId,
      }),
      reactions: [],
    });

    if (Boolean(forwardPhotos.length))
      await this.photoRepo.batchCreate(forwardPhotos);

    if (Boolean(forwardVideos.length))
      await this.videoRepo.batchCreate(forwardVideos);

    if (Boolean(forwardDocuments.length))
      await this.documentRepo.batchCreate(forwardDocuments);

    if (Boolean(forwardFiles.length))
      await this.fileRepo.batchCreate(forwardFiles);

    if (Boolean(filesMap.size)) {
      const pr = [];

      filesMap.forEach((destFileId, sourceFileId) => {
        pr.push(async () =>
          this.fileStorageService.copyChatFile(
            new ChatFilePath(fromChatId, new FileId(sourceFileId)),
            new ChatFilePath(toChatId, new FileId(destFileId))
          )
        );
      });

      await Promise.all(pr.map((r) => r()));
    }

    await this.messageRepo.save(newMessage);

    return newMessage;
  }
}
