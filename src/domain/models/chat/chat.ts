import { ChatCreatedDomainEvent } from "@domain/models/chat/events/chat-created";
import { ChatDescriptionChangedDomainEvent } from "@domain/models/chat/events/chat-description-changed";
import { ChatLastMessageIdUpdatedDomainEvent } from "@domain/models/chat/events/chat-last-message-id-updated";
import { ChatLockedDomainEvent } from "@domain/models/chat/events/chat-locked";
import { ChatTitleChangedDomainEvent } from "@domain/models/chat/events/chat-title-changed";
import { AggregateRoot, EntityId, ValueObject } from "@libs/ddd";
import { ChatOwnerId } from "../chat-owner/chat-owner";
import { MessageId } from "../message/message";
import { Photo } from "../photo";
import { Member } from "../member/member";
import { ChatPhotoEditedDomainEvent } from "./events/chat-photo-edited";
import { ChatAdmin } from "../chat-admin/chat-admin";

export enum ChatStatus {
  ACTIVE = "active",
  LOCKED = "locked",
}

export enum ChatTypes {
  GROUP = "group_chat",
  PRIVATE = "private_chat",
  SELF = "self_chat",
}

export interface IChatProps {
  title: string;
  description: string;
  ownerId: ChatOwnerId;
  photo: Photo;
  lastMessageId: MessageId;
  status: ChatStatus;
  type: ChatTypes;
  accessKey: string;
  memberCount: number;
}

export class ChatId extends EntityId {}

export interface IChatInfoProps {
  title: string;
  description: string;
}

export class ChatInfo extends ValueObject<IChatInfoProps> {
  constructor(props: IChatInfoProps) {
    super(props);
  }

  validate() {}

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }
}

export class Chat extends AggregateRoot<ChatId, IChatProps> {
  protected _title: string;
  protected _description: string;
  // protected _info: ChatInfo
  protected _ownerId: ChatOwnerId;
  protected _photo: Photo;
  protected _status: ChatStatus;
  protected _lastMessageId: MessageId;
  protected _type: ChatTypes;
  protected _accessKey: string;
  protected _memberCount: number;

  constructor(props: IChatProps, version: number, id?: ChatId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return ChatId;
  }

  protected init() {
    this._title = this.props.title;
    this._description = this.props.description;
    this._ownerId = this.props.ownerId;
    this._photo = this.props.photo;
    this._status = this.props.status;
    this._lastMessageId = this.props.lastMessageId;
    this._type = this.props.type;
    this._accessKey = this.props.accessKey;
    this._memberCount = this.props.memberCount;
  }

  validateProps() {}

  validate() {}

  static create(props: IChatProps) {
    const newChatId = new ChatId();

    const newChat = new Chat(
      {
        ...props,
        title:
          props.type === ChatTypes.GROUP && props?.title
            ? props.title
            : `Chat_${newChatId.value}`,
      },
      0,
      newChatId
    );

    newChat.addEvent(
      new ChatCreatedDomainEvent({
        aggregateId: newChat.id,
        chatId: newChat.id,
        title: newChat.title,
        ownerId: newChat.ownerId,
      })
    );

    return newChat;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get ownerId() {
    return this._ownerId;
  }

  get photo() {
    return this._photo;
  }

  get status() {
    return this._status;
  }

  get lastMessageId() {
    return this._lastMessageId;
  }

  get type() {
    return this._type;
  }

  get accessKey() {
    return this._accessKey;
  }

  get memberCount() {
    return this._memberCount;
  }

  lock() {
    this.update(() => {
      this._status = ChatStatus.LOCKED;
    });

    this.addEvent(
      new ChatLockedDomainEvent({
        aggregateId: this.id,
        chatId: this.id,
      })
    );
  }

  isActive() {
    return this._status === ChatStatus.ACTIVE;
  }

  isLocked() {
    return this._status === ChatStatus.LOCKED;
  }

  isProtected() {
    return Boolean(this._accessKey);
  }

  isGroup() {
    return this.type === ChatTypes.GROUP;
  }

  isPrivate() {
    return this.type === ChatTypes.PRIVATE;
  }

  isSelf() {
    return this.type === ChatTypes.SELF;
  }

  updateMemberCount(memberCount: number) {
    if (this.memberCount === memberCount) return;

    this.update(() => {
      this._memberCount = memberCount;
    });
  }

  updateLastMessageId(messageId: MessageId) {
    if (this.lastMessageId?.equals(messageId)) return;

    this.update(() => {
      this._lastMessageId = messageId;
    });

    this.addEvent(
      new ChatLastMessageIdUpdatedDomainEvent({
        aggregateId: this.id,
        chatId: this.id,
        lastMessageId: this.lastMessageId,
      })
    );
  }

  editInfo(info: ChatInfo) {}

  editTitle(title: string) {
    if (this.title === title) return;

    const oldTitle = this.title;

    this.update(() => {
      this._title = title;
    });

    this.addEvent(
      new ChatTitleChangedDomainEvent({
        aggregateId: this.id,
        chatId: this.id,
        oldTitle,
        newTitle: this.title,
      })
    );
  }

  editDescription(editor: Member | ChatAdmin, description: string) {
    if (this.description === description) return;

    const oldDescription = this.description;

    this.update(() => {
      this._description = description;
    });

    this.addEvent(
      new ChatDescriptionChangedDomainEvent({
        aggregateId: this.id,
        chatId: this.id,
        oldDescription,
        newDescription: this.description,
      })
    );
  }

  editPhoto(editor: Member, photo: Photo) {
    if (!editor) throw new Error("Editor cannot be null");

    this.update(() => {
      this._photo = photo;
    });

    this.addEvent(
      new ChatPhotoEditedDomainEvent({
        aggregateId: this.id,
        chatId: this.id,
        editorMemberId: editor.id,
      })
    );
  }
}
