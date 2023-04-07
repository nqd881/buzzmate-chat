export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  rootUserId: string;
}

export class ChatMemberResponseDto {
  id: string;
  chatId: string;
  userId: string;
  name: string;
  nickname: string;
  inviterUserId: string;
  joinedDate: number;
  isBanned: boolean;
  hasLeft: boolean;
  leaveDate?: number;
  bannedDate?: number;
  isAdmin?: boolean;
  isOwner?: boolean;
  // isMe?: boolean;
}

export class FileResponseDto {
  id: string;
  name: string;
  size: number;
  mimetype: string;
  date: Date;
}

export class PhotoSizeResponseDto {
  width: number;
  height: number;
  file: FileResponseDto;
}

export class PhotoResponseDto {
  id: string;
  file: FileResponseDto;
  // original: PhotoSizeResponseDto;
  // variants: Map<string, PhotoSizeResponseDto>;
}

export class VideoResponseDto {
  id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail: any;
  file: FileResponseDto;
}

export class DocumentResponseDto {
  id: string;
  file: FileResponseDto;
}

export class MessageResponseDto {
  id: string;
  chatId: string;
  senderUserId: string;
  // sentByMyself: boolean;
  sentByMember: ChatMemberResponseDto;
  content: {
    text: string;
    photoIds: string[];
    videoIds: string[];
    documentIds: string[];
  };
  date: number;
  editDate: number;
  replyToMessageId: string;
  forwardInfo?: {
    fromChatId: string;
    fromMessageId: string;
    senderUserId: string;
  };
  seenByUserIds?: string[];
  views?: number;
  reactions?: any;
}

export class ChatResponseDto {
  id: string;
  title: string;
  description: string;
  isGroupChat: boolean;
  isPrivateChat: boolean;
  isSelfChat: boolean;
  isMyFave: boolean;
  isArchived: boolean;
  lastMessage: MessageResponseDto;
  memberCount: number;
}
