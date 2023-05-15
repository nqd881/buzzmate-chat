import { ValueObject } from "@libs/ddd";
import { MemberId } from "../member/member";

export type MessageReactionValue = string;

export interface IMessageReactionProps {
  memberId: MemberId;
  reactionValue: MessageReactionValue;
}

export class MessageReaction extends ValueObject<IMessageReactionProps> {
  constructor(props: IMessageReactionProps) {
    super(props);
  }

  validate() {}

  get memberId() {
    return this.props.memberId;
  }

  get reactionValue() {
    return this.props.reactionValue;
  }
}
