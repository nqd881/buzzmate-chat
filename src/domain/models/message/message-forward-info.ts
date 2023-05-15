import { ValueObject } from "@libs/ddd";
import { ChatId } from "../chat/chat";
import { UserId } from "../user/user";
import { MessageId } from "./message";

export interface IMessageForwardInfoProps {
  fromChatId: ChatId;
  fromMessageId: MessageId;
  senderUserId: UserId;
}

export class MessageForwardInfo extends ValueObject<IMessageForwardInfoProps> {
  constructor(props: IMessageForwardInfoProps) {
    super(props);
  }

  protected validate() {}

  get fromChatId() {
    return this.props.fromChatId;
  }

  get fromMessageId() {
    return this.props.fromMessageId;
  }

  get senderUserId() {
    return this.props.senderUserId;
  }
}
