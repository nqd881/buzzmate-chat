import {ChatMemberStatus, ChatMemberStatusProps} from "../chat-member-status";

export interface ChatMemberStatusLeftProps {
  leaveDate: Date;
}

export class ChatMemberStatusLeft extends ChatMemberStatus<ChatMemberStatusLeftProps> {
  constructor(props: ChatMemberStatusProps<ChatMemberStatusLeftProps>) {
    super(props);
  }

  protected validate() {}

  get leaveDate() {
    return this.props.leaveDate;
  }
}
