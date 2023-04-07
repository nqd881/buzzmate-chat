import {ChatId} from "@domain/models/chat/chat";
import {File, FileId} from "@domain/models/file/file";

export interface IFileStorageService {
  saveChatFile(chatId: ChatId, file: File, content: Buffer): void;
  getChatFileReadStream(chatId: ChatId, fileId: FileId): NodeJS.ReadableStream;
}
