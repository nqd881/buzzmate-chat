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

export interface IPhotoQueryModel {
  width: number;
  height: number;
  size: number;
  mimetype: string;
  url: string;
}

export interface IVideoThumbnailQueryModel {}

export interface IVideoQueryModel {
  width: number;
  height: number;
  duration: number;
  thumbnail: IVideoThumbnailQueryModel;
  size: number;
  mimetype: string;
  url: string;
}

export interface IDocumentQueryModel {
  fileName: string;
  size: number;
  mimetype: string;
  url: string;
}

export interface IAudioQueryModel {
  title: string;
  duration: number;
  size: number;
  mimetype: string;
  url: string;
}

export interface IMessageContentQueryModel {
  text: string;
  photo: IPhotoQueryModel;
  video: IVideoQueryModel;
  audio: IAudioQueryModel;
  document: IDocumentQueryModel;
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
