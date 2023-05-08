import { Query, QueryProps } from "@libs/ddd";

export class FindChatVideosQuery extends Query {
  public readonly chatId: string;
  public readonly byIds: string[];

  constructor(props: QueryProps<FindChatVideosQuery>) {
    super(props);

    this.chatId = props.chatId;
    this.byIds = props.byIds;
  }
}
