import { MessageCreatedDomainEvent } from "@domain/models/message/events/message-created";
import { MessageHiddenDomainEvent } from "@domain/models/message/events/message-hidden";
import { MessagePinnedDomainEvent } from "@domain/models/message/events/message-pinned";
import { MessageReactionAddedDomainEvent } from "@domain/models/message/events/message-reaction-added";
import { MessageReactionsOfMemberClearedDomainEvent } from "@domain/models/message/events/message-reactions-of-member-cleared";
import { AggregateRoot, EntityId } from "@libs/ddd";
import { ChatId } from "../chat/chat";
import { UserId } from "../user/user";
import { MessageUnpinnedDomainEvent } from "./events/message-unpined";
import { MessageContent } from "./message-content";
import { MessageForwardInfo } from "./message-forward-info";
import { MessageReaction } from "./message-reaction";
import { MemberId } from "../member/member";

export interface IMessageProps<T extends MessageContent<any>> {
  chatId: ChatId;
  senderUserId: UserId;
  content: T;
  isPinned: boolean;
  isHidden: boolean;
  date: Date;
  editDate: Date;
  replyToMessageId: MessageId;
  forwardInfo: MessageForwardInfo;
  reactions: MessageReaction[];
}

export class MessageId extends EntityId {}

export class Message<T extends MessageContent<any>> extends AggregateRoot<
  MessageId,
  IMessageProps<T>
> {
  protected _chatId: ChatId;
  protected _senderUserId: UserId;
  protected _content: T;
  protected _isPinned: boolean;
  protected _isHidden: boolean;
  protected _date: Date;
  protected _editDate: Date;
  protected _replyToMessageId: MessageId;
  protected _forwardInfo: MessageForwardInfo;
  protected _reactions: MessageReaction[];

  constructor(props: IMessageProps<T>, version: number, id?: MessageId) {
    super(props, version, id);
  }

  protected get IdConstructor() {
    return MessageId;
  }

  protected init() {
    this._chatId = this.props.chatId;
    this._senderUserId = this.props.senderUserId;
    this._content = this.props.content;
    this._isPinned = this.props.isPinned;
    this._isHidden = this.props.isHidden;
    this._date = this.props.date;
    this._editDate = this.props.editDate;
    this._replyToMessageId = this.props.replyToMessageId;
    this._forwardInfo = this.props.forwardInfo;
    this._reactions = this.props.reactions;
  }

  validateProps() {}

  validate() {}

  static create<T extends MessageContent<any>>(
    props: IMessageProps<T>,
    id?: MessageId
  ) {
    const newMessage = new Message(props, 0, id);

    newMessage.addEvent(
      new MessageCreatedDomainEvent({
        aggregateId: newMessage.id,
        chatId: newMessage.chatId,
        messageId: newMessage.id,
        replyToMessageId: newMessage.replyToMessageId,
        senderUserId: newMessage.senderUserId,
        contentType: newMessage.contentType,
        forwardInfo: newMessage.forwardInfo,
      })
    );

    return newMessage;
  }

  get chatId() {
    return this._chatId;
  }

  get senderUserId() {
    return this._senderUserId;
  }

  get content() {
    return this._content;
  }

  get isPinned() {
    return this._isPinned;
  }

  get isHidden() {
    return this._isHidden;
  }

  get date() {
    return this._date;
  }

  get editDate() {
    return this._editDate;
  }

  get replyToMessageId() {
    return this._replyToMessageId;
  }

  get forwardInfo() {
    return this._forwardInfo;
  }

  get reactions() {
    return this._reactions;
  }

  get contentType() {
    return this._content.constructor.name;
  }

  pin() {
    if (this.isPinned) return;

    this.update(() => {
      this._isPinned = true;
    });

    this.addEvent(
      new MessagePinnedDomainEvent({
        aggregateId: this.id,
        chatId: this.chatId,
        messageId: this.id,
      })
    );
  }

  unpin() {
    if (!this.isPinned) return;

    this.update(() => {
      this._isPinned = false;
    });

    this.addEvent(
      new MessageUnpinnedDomainEvent({
        aggregateId: this.id,
        chatId: this.chatId,
        messageId: this.id,
      })
    );
  }

  hide() {
    if (this.isHidden) return;

    this.update(() => {
      this._isHidden = true;
    });

    this.addEvent(
      new MessageHiddenDomainEvent({
        aggregateId: this.id,
        chatId: this.chatId,
        messageId: this.id,
      })
    );
  }

  addReaction(messageReaction: MessageReaction) {
    this.update(() => {
      this._reactions.push(messageReaction);
    });

    this.addEvent(
      new MessageReactionAddedDomainEvent({
        aggregateId: this.id,
        chatId: this.chatId,
        messageId: this.id,
        memberId: messageReaction.memberId,
        reactionValue: messageReaction.reactionValue,
      })
    );
  }

  clearReactionsOfMember(memberId: MemberId) {
    this.update(() => {
      this._reactions = this._reactions.filter(
        (reaction) => !reaction.memberId.equals(memberId)
      );
    });

    this.addEvent(
      new MessageReactionsOfMemberClearedDomainEvent({
        aggregateId: this.id,
        messageId: this.id,
        memberId,
      })
    );
  }
}
