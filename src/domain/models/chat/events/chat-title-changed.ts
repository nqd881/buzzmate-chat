import {ChatId} from "@domain/models/chat/chat";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatTitleChangedDomainEvent extends DomainEvent<ChatTitleChangedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly oldTitle: string;
  public readonly newTitle: string;

  constructor(props: DomainEventProps<ChatTitleChangedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.oldTitle = props.oldTitle;
    this.newTitle = props.newTitle;
  }
}
