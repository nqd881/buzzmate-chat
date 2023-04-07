import {ChatMemberStatus, ChatMemberStatusProps} from "../chat-member-status";

export interface ChatMemberStatusActiveProps {}

export class ChatMemberStatusActive extends ChatMemberStatus<ChatMemberStatusActiveProps> {
  constructor(props: ChatMemberStatusProps<ChatMemberStatusActiveProps>) {
    super(props);
  }

  protected validate() {}
}
