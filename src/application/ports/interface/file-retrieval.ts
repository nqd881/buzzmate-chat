export interface IFileRetrievalService {
  createMessageFileReadStream(
    chatId: string,
    messageId: string
  ): NodeJS.ReadableStream;
}
