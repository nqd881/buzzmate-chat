import { ChatId } from "@domain/models/chat/chat";
import { File } from "@domain/models/file";
import { Message, MessageId } from "@domain/models/message/message";

export class MessageFilePath {
  constructor(
    public readonly chatId: ChatId,
    public readonly messageId: MessageId
  ) {}

  static fromMessage(message: Message<any>) {
    return new MessageFilePath(message.chatId, message.id);
  }
}

export interface IFileStorageService {
  saveMessageFile(
    path: MessageFilePath,
    file: File,
    content: Buffer
  ): Promise<any>;

  copyMessageFile(
    sourcePath: MessageFilePath,
    destPath: MessageFilePath
  ): Promise<any>;
}
