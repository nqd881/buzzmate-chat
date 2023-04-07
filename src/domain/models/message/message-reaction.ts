import {ValueObject, ValueObjectProps} from "@libs/ddd";
import {ChatMemberId} from "../chat-member/chat-member";

export type MessageReactionValue = string;

export interface IMessageReactionProps {
  chatMemberId: ChatMemberId;
  reactionValue: MessageReactionValue;
}

export class MessageReaction extends ValueObject<IMessageReactionProps> {
  constructor(props: ValueObjectProps<IMessageReactionProps>) {
    super(props);
  }

  validate() {}

  get chatMemberId() {
    return this.props.chatMemberId;
  }

  get reactionValue() {
    return this.props.reactionValue;
  }
}
