import {ChatOwnerCreatedDomainEvent} from "@domain/models/chat-owner/events/chat-owner-created";
import {AggregateRoot, EntityId} from "@libs/ddd";
import {ChatId} from "../chat/chat";
import {UserId} from "../user/user";

export interface IChatOwnerProps {
  userId: UserId;
  maxCreations: number;
  chatIds: ChatId[];
}

export class ChatOwnerId extends EntityId {}

export class ChatOwner extends AggregateRoot<ChatOwnerId, IChatOwnerProps> {
  protected _userId: UserId;
  protected _maxCreations: number;
  protected _chatIds: ChatId[];

  constructor(props: IChatOwnerProps, version: number, id?: ChatOwnerId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return ChatOwnerId;
  }

  protected init() {
    this._userId = this.props.userId;
    this._maxCreations = this.props.maxCreations;
    this._chatIds = this.props.chatIds;
  }

  validateProps() {}

  validate() {}

  static create(props: IChatOwnerProps) {
    const newChatOwner = new ChatOwner(props, 0);

    newChatOwner.addEvent(
      new ChatOwnerCreatedDomainEvent({
        aggregateId: newChatOwner.id,
        userId: newChatOwner.userId,
        chatOwnerId: newChatOwner.id,
      })
    );

    return newChatOwner;
  }

  get userId() {
    return this._userId;
  }

  get maxCreations() {
    return this._maxCreations;
  }

  get creationCount() {
    return this._chatIds.length;
  }

  get chatIds() {
    return this._chatIds;
  }

  reachMaxCreations() {
    return this.creationCount >= this.maxCreations;
  }

  addChatId(aChatId: ChatId) {
    this.update(() => {
      this._chatIds.push(aChatId);
    });
  }

  removeChatId(aChatId: ChatId) {
    this.update(() => {
      this._chatIds = this._chatIds.filter((chatId) => !chatId.equals(aChatId));
    });
  }

  isOwnerOfChat(aChatId: ChatId): boolean {
    return Boolean(this.chatIds.find((chatId) => chatId.equals(aChatId)));
  }
}
