import { Query, QueryProps } from "@libs/ddd";

export class FindChatDocumentsQuery extends Query {
  public readonly chatId: string;
  public readonly byIds: string[];

  constructor(props: QueryProps<FindChatDocumentsQuery>) {
    super(props);

    this.chatId = props.chatId;
    this.byIds = props.byIds;
  }
}
