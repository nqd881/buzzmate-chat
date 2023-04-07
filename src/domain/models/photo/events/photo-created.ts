import {ChatId} from "@domain/models/chat/chat";
import {PhotoId} from "@domain/models/photo/photo";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class PhotoCreatedDomainEvent extends DomainEvent<PhotoCreatedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly photoId: PhotoId;

  constructor(props: DomainEventProps<PhotoCreatedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.photoId = props.photoId;
  }
}
