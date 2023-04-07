import {ChatId} from "@domain/models/chat/chat";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class ChatDescriptionChangedDomainEvent extends DomainEvent<ChatDescriptionChangedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly oldDescription: string;
  public readonly newDescription: string;

  constructor(props: DomainEventProps<ChatDescriptionChangedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.oldDescription = props.oldDescription;
    this.newDescription = props.newDescription;
  }
}
