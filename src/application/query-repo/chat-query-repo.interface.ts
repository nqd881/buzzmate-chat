import { MaybePromise } from "@libs/utilities/types";
import {
  ChatMemberResponseDto,
  ChatResponseDto,
  DocumentResponseDto,
  MessageResponseDto,
  PhotoResponseDto,
  UserResponseDto,
  VideoResponseDto,
} from "./response-dto";

export type GetChatsOptions = {
  byIds?: string[];
  limit?: number;
  fave?: boolean;
  archived?: boolean;
};

export type GetMessagesOptions = {
  limit?: number;
  byIds?: string[];
  byTimeEndpoint?: {
    afterTime?: Date | number;
    beforeTime?: Date | number;
  };
  byIdEndpoint?: {
    afterMessageId?: string;
    beforeMessageId?: string;
  };
};

export type GetMembersOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export type GetPhotosOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export type GetVideosOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export type GetDocumentsOptions = {
  limit?: number;
  byIds?: string[];
  exclude?: string[];
};

export type GetUsersOptions = {
  limit?: number;
  byIds?: string[];
  byEmails?: string[];
  byNames?: string[];
  exclude?: string[];
};

export interface IChatQueryRepo {
  getChats(
    userId: string,
    options?: GetChatsOptions
  ): MaybePromise<ChatResponseDto[]>;

  getMessages(
    userId: string,
    chatId: string,
    options?: GetMessagesOptions
  ): MaybePromise<MessageResponseDto[]>;

  getMembers(
    userId: string,
    chatId: string,
    options?: GetMembersOptions
  ): MaybePromise<ChatMemberResponseDto[]>;

  getPhotos(
    chatId: string,
    options?: GetPhotosOptions
  ): MaybePromise<PhotoResponseDto[]>;

  getVideos(
    chatId: string,
    options?: GetVideosOptions
  ): MaybePromise<VideoResponseDto[]>;

  getDocuments(
    chatId: string,
    options?: GetDocumentsOptions
  ): MaybePromise<DocumentResponseDto[]>;

  //
  //
  //

  getUsers(options?: GetUsersOptions): MaybePromise<UserResponseDto[]>;
}
