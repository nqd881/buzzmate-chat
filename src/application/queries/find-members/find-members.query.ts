import { Query, QueryProps } from "@libs/ddd";

export class FindMembersQuery extends Query {
  public readonly chatId: string;
  public readonly byIds?: string[];
  public readonly limit?: number;

  constructor(props: QueryProps<FindMembersQuery>) {
    super(props);

    this.chatId = props.chatId;
    this.byIds = props?.byIds;
    this.limit = props?.limit;
  }
}
