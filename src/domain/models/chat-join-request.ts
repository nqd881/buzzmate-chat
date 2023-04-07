import {Entity, EntityId} from "@libs/ddd";

export interface IChatJoinRequestProps {}

export class ChatJoinRequestId extends EntityId {}

export class ChatJoinRequest extends Entity<
  ChatJoinRequestId,
  IChatJoinRequestProps
> {
  constructor(props: IChatJoinRequestProps, id?: ChatJoinRequestId) {
    super(props, id);
  }

  protected get IdConstructor() {
    return ChatJoinRequestId;
  }

  protected init() {}

  protected validateProps() {}

  validate() {}
}
