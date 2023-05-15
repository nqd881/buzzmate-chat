import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { ChatId } from "../chat";
import { MemberId } from "@domain/models/member/member";

export class ChatPhotoEditedDomainEvent extends DomainEvent<ChatPhotoEditedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly editorMemberId: MemberId;

  constructor(props: DomainEventProps<ChatPhotoEditedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.editorMemberId = props.editorMemberId;
  }
}
