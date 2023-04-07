import {ChatMemberStatus, ChatMemberStatusProps} from "../chat-member-status";

export interface ChatMemberStatusBannedProps {
  bannedDate: Date;
  reason: string;
}

export class ChatMemberStatusBanned extends ChatMemberStatus<ChatMemberStatusBannedProps> {
  constructor(props: ChatMemberStatusProps<ChatMemberStatusBannedProps>) {
    super(props);
  }

  protected validate() {}

  get bannedDate() {
    return this.props.bannedDate;
  }

  get reason() {
    return this.props.reason;
  }
}
