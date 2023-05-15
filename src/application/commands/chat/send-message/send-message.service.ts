import { Repositories } from "@application/di-tokens/repositories";
import { Ports } from "@application/ports/constants";
import {
  IFileStorageService,
  MessageFilePath,
} from "@application/ports/interface/file-storage";
import { Audio } from "@domain/models/audio";
import { ChatId } from "@domain/models/chat/chat";
import { IChatRepo } from "@domain/models/chat/chat-repo.interface";
import { Document } from "@domain/models/document";
import { File } from "@domain/models/file";
import { IMemberRepo } from "@domain/models/member/member-repo.interface";
import { Message, MessageId } from "@domain/models/message/message";
import { MessageContentAudio } from "@domain/models/message/message-content/audio.content";
import { MessageContentDocument } from "@domain/models/message/message-content/document.content";
import { MessageContent } from "@domain/models/message/message-content/interface/message-content";
import { MessageContentPhoto } from "@domain/models/message/message-content/photo.content";
import { MessageContentText } from "@domain/models/message/message-content/text.content";
import { MessageContentVideo } from "@domain/models/message/message-content/video.content";
import { IMessageRepo } from "@domain/models/message/message-repo.interface";
import { Photo } from "@domain/models/photo";
import { UserId } from "@domain/models/user/user";
import { Video } from "@domain/models/video";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendMessageCommand } from "./send-message.command";

@CommandHandler(SendMessageCommand)
export class SendMessageService implements ICommandHandler {
  constructor(
    @Inject(Repositories.Chat) private chatRepo: IChatRepo,
    @Inject(Repositories.Message) private messageRepo: IMessageRepo,
    @Inject(Repositories.Member) private memberRepo: IMemberRepo,
    @Inject(Ports.FileStorageService)
    private readonly fileStorageService: IFileStorageService
  ) {}

  async execute(command: SendMessageCommand) {
    const prepareMessageId = new MessageId(command?.prepareMessageId);
    const userId = new UserId(command.metadata.userId);
    const chatId = new ChatId(command.chatId);
    const replyToMessageId = command.replyToMessageId
      ? new MessageId(command.replyToMessageId)
      : null;
    const inputText = command.message;
    const inputFile = command.file;

    const chat = await this.chatRepo.findOneById(chatId);

    if (!chat) throw new Error("Chat not found");

    const member = await this.memberRepo.findMemberByUserId(chatId, userId);

    if (!member) throw new Error("Member not found");

    const content = ((): MessageContent<any> => {
      if (!inputFile) {
        return new MessageContentText({
          text: inputText,
          webPage: null,
        });
      }

      const newFile = new File({
        name: inputFile.name,
        mimetype: inputFile.mimetype,
        size: inputFile.size,
      });

      const fileType = inputFile.mimetype.split("/")[0];

      switch (true) {
        case fileType === "image": {
          return new MessageContentPhoto({
            caption: inputText,
            photo: new Photo({
              height: null,
              width: null,
              file: newFile,
            }),
          });
        }
        case fileType === "video": {
          return new MessageContentVideo({
            caption: inputText,
            video: new Video({
              duration: null,
              height: null,
              width: null,
              thumbnail: null,
              file: newFile,
            }),
          });
        }
        case fileType === "audio": {
          return new MessageContentAudio({
            caption: inputText,
            audio: new Audio({
              title: null,
              duration: null,
              file: newFile,
            }),
          });
        }
        default: {
          return new MessageContentDocument({
            caption: inputText,
            document: new Document({
              file: newFile,
            }),
          });
        }
      }
    })();

    const newMessage = Message.create(
      {
        chatId,
        senderUserId: userId,
        content,
        replyToMessageId,
        forwardInfo: null,
      },
      prepareMessageId
    );

    if (newMessage.content.hasFile()) {
      const file = newMessage.content.getFile();

      await this.fileStorageService.saveMessageFile(
        MessageFilePath.fromMessage(newMessage),
        file,
        inputFile.content
      );
    }

    await this.messageRepo.save(newMessage);

    return newMessage;
  }
}
