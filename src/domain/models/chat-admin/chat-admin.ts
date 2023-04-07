import {AggregateRoot, EntityId} from "@libs/ddd";
import {ChatId} from "../chat/chat";
import {UserId} from "../user/user";
import {ChatAdminCreatedDomainEvent} from "./events/chat-admin-created";

export interface IChatAdminProps {
  chatId: ChatId;
  userId: UserId;
}

export class ChatAdminId extends EntityId {}

export class ChatAdmin extends AggregateRoot<ChatAdminId, IChatAdminProps> {
  protected _chatId: ChatId;
  protected _userId: UserId;

  constructor(props: IChatAdminProps, version: number, id?: ChatAdminId) {
    super(props, version, id);
  }

  protected get IdConstructor() {
    return ChatAdminId;
  }

  protected init() {
    this._chatId = this.props.chatId;
    this._userId = this.props.userId;
  }

  protected validateProps() {}

  validate() {}

  static create(props: IChatAdminProps) {
    const newAdmin = new ChatAdmin(props, 0);

    newAdmin.addEvent(
      new ChatAdminCreatedDomainEvent({
        aggregateId: newAdmin.id,
        chatId: newAdmin.chatId,
        userId: newAdmin.userId,
      })
    );

    return newAdmin;
  }

  get chatId() {
    return this._chatId;
  }

  get userId() {
    return this._userId;
  }
}
