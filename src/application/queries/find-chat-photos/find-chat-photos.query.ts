import { Query, QueryProps } from "@libs/ddd";

export class FindChatPhotosQuery extends Query {
  public readonly chatId: string;
  public readonly byIds: string[];

  constructor(props: QueryProps<FindChatPhotosQuery>) {
    super(props);

    this.chatId = props.chatId;
    this.byIds = props.byIds;
  }
}
