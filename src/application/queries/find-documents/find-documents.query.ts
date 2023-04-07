import { Query, QueryProps } from "@libs/ddd";

export class FindDocumentsQuery extends Query {
  public readonly chatId: string;
  public readonly byIds: string[];

  constructor(props: QueryProps<FindDocumentsQuery>) {
    super(props);

    this.chatId = props.chatId;
    this.byIds = props.byIds;
  }
}
