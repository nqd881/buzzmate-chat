export interface IUserQueryModel {
  id: string;
  identity: string;
  emailAddress: string;
  name: string;
  type: string;
}

export interface IMemberQueryModel {
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

export interface IFileQueryModel {
  id: string;
  name: string;
  size: number;
  mimetype: string;
  date: Date;
}

export interface IPhotoQueryModel {
  id: string;
  width: number;
  height: number;
  file: IFileQueryModel;
  url: string;
}

export interface IVideoQueryModel {
  id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail: any;
  file: IFileQueryModel;
  url: string;
}

export interface IDocumentQueryModel {
  id: string;
  file: IFileQueryModel;
  url: string;
}

export interface IMessageContentQueryModel {
  text: string;
  photos: IPhotoQueryModel[];
  videos: IVideoQueryModel[];
  documents: IDocumentQueryModel[];
}

export interface IMessageForwardInfoQueryModel {
  fromChatId: string;
  fromMessageId: string;
  senderUserId: string;
}

export interface IMessageQueryModel {
  id: string;
  chatId: string;
  senderUserId: string;
  sentByMember: IMemberQueryModel;
  content: IMessageContentQueryModel;
  date: number;
  editDate: number;
  replyToMessageId: string;
  forwardInfo?: IMessageForwardInfoQueryModel;
  seenByUserIds?: string[];
  views?: number;
  reactions?: any;
}

export interface IChatQueryModel {
  id: string;
  title: string;
  description: string;
  isGroupChat: boolean;
  isPrivateChat: boolean;
  isSelfChat: boolean;
  lastMessage: IMessageQueryModel;
  memberCount: number;
  isFave?: boolean;
  isArchived?: boolean;
}
