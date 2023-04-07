import {ValueObject, ValueObjectProps} from "@libs/ddd";
import {ChatId} from "../chat/chat";

export interface IUserChatProps {
  chatId: ChatId;
  isFave: boolean;
  isArchived: boolean;
}

export class UserChat extends ValueObject<IUserChatProps> {
  constructor(props: ValueObjectProps<IUserChatProps>) {
    super(props);
  }

  protected validate() {}

  get chatId() {
    return this.props.chatId;
  }

  get isFave() {
    return this.props.isFave;
  }

  get isArchived() {
    return this.props.isArchived;
  }
}
