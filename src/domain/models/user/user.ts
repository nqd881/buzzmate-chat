import {UserCreatedDomainEvent} from "@domain/models/user/events/user-created";
import {AggregateRoot, EntityId} from "@libs/ddd";
import {ChatId} from "../chat/chat";
import {IUserChatProps, UserChat} from "./user-chat";
import {UserPrivacy} from "./user-privacy";

export enum UserTypes {
  Standard = "user_standard",
  Plus = "user_plus",
  Pro = "user_pro",
}

export interface IUserProps {
  identity: string;
  name: string;
  emailAddress: string;
  type: UserTypes;
  chats: UserChat[];
  privacy: UserPrivacy;
}

export class UserId extends EntityId {}

export class User extends AggregateRoot<UserId, IUserProps> {
  protected _identity: string;
  protected _name: string;
  protected _emailAddress: string;
  protected _type: UserTypes;
  protected _chats: UserChat[];
  protected _privacy: UserPrivacy;

  constructor(props: IUserProps, version: number, id?: UserId) {
    super(props, version, id);
  }

  protected get IdConstructor() {
    return UserId;
  }

  protected init() {
    this._identity = this.props.identity;
    this._name = this.props.name;
    this._emailAddress = this.props.emailAddress;
    this._type = this.props.type;
    this._chats = this.props.chats;
    this._privacy = this.props.privacy;
  }

  protected validateProps(props: IUserProps) {}

  public validate(): void {}

  static create(props: IUserProps) {
    const newUser = new User(props, 0);

    newUser.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: newUser.id,
        userId: newUser.id,
        identity: newUser.identity,
        name: newUser.name,
        emailAddress: newUser.emailAddress,
        type: newUser.type,
      })
    );

    return newUser;
  }

  get identity() {
    return this._identity;
  }

  get name() {
    return this._name;
  }

  get emailAddress() {
    return this._emailAddress;
  }

  get type() {
    return this._type;
  }

  get chats() {
    return this._chats;
  }

  get privacy() {
    return this._privacy;
  }

  private getChatIndex(chatId: ChatId) {
    return this.chats.findIndex((userChat) => userChat.chatId.equals(chatId));
  }

  getChat(chatId: ChatId) {
    return this.chats.find((userChat) => userChat.chatId.equals(chatId));
  }

  checkChatIsExistent(chatId: ChatId) {
    return this.chats.some((userChat) => userChat.chatId.equals(chatId));
  }

  addChat(userChat: UserChat) {
    const isExistent = this.checkChatIsExistent(userChat.chatId);

    if (isExistent) throw new Error("Chat is existent");

    this.update(() => {
      this._chats.push(userChat);
    });
  }

  updateChat(chatId: ChatId, props: Partial<Omit<IUserChatProps, "chatId">>) {
    const index = this.getChatIndex(chatId);

    this.update(() => {
      this._chats[index] = this._chats[index].cloneWith(props);
    });
  }

  markFaveChat(chatId: ChatId, fave: boolean) {
    this.updateChat(chatId, {isFave: fave});
  }

  markArchivedChat(chatId: ChatId, archived: boolean) {
    this.updateChat(chatId, {isArchived: archived});
  }

  updatePrivacy() {}
}
