import { ChatId } from "@domain/models/chat/chat";
import { FileId } from "@domain/models/file/file";

export class ChatFilePath {
  constructor(public readonly chatId: ChatId, public readonly fileId: FileId) {}
}

export interface IFileStorageService {
  saveChatFile(path: ChatFilePath, content: Buffer): Promise<void>;
  getChatFileReadStream(path: ChatFilePath): NodeJS.ReadableStream;
  copyChatFile(sourcePath: ChatFilePath, destPath: ChatFilePath): Promise<any>;
}
