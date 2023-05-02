export class UserQueryModel {
  id: string;
  identity: string;
  emailAddress: string;
  name: string;
  type: string;
}

export class MemberQueryModel {
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
}

export class FileQueryModel {
  id: string;
  name: string;
  size: number;
  mimetype: string;
  date: Date;
}

export class PhotoQueryModel {
  id: string;
  width: number;
  height: number;
  file: FileQueryModel;
  url: string;
}

export class VideoQueryModel {
  id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail: any;
  file: FileQueryModel;
  url: string;
}

export class DocumentQueryModel {
  id: string;
  file: FileQueryModel;
  url: string;
}

export class MessageQueryModel {
  id: string;
  chatId: string;
  senderUserId: string;
  sentByMember: MemberQueryModel;
  content: {
    text: string;
    photos: PhotoQueryModel[];
    videos: VideoQueryModel[];
    documents: DocumentQueryModel[];
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

export class ChatQueryModel {
  id: string;
  title: string;
  description: string;
  isGroupChat: boolean;
  isPrivateChat: boolean;
  isSelfChat: boolean;
  lastMessage: MessageQueryModel;
  memberCount: number;
  isFave?: boolean;
  isArchived?: boolean;
}
