import { ChatId } from "@domain/models/chat/chat";
import { DomainEvent, DomainEventProps } from "@libs/ddd";
import { MemberId } from "../member";

export class MemberNicknameEditedDomainEvent extends DomainEvent<MemberNicknameEditedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly editedMemberId: MemberId;
  public readonly editorMemberId: MemberId;

  constructor(props: DomainEventProps<MemberNicknameEditedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.editedMemberId = props.editedMemberId;
    this.editorMemberId = props.editorMemberId;
  }
}
