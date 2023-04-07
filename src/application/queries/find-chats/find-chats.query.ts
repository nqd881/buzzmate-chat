import { Query, QueryProps } from "@libs/ddd/query";

export class FindChatsQuery extends Query {
  public readonly byIds?: string[];
  public readonly limit?: number;
  public readonly fave?: boolean;
  public readonly archived?: boolean;

  constructor(props: QueryProps<FindChatsQuery>) {
    super(props);

    this.byIds = props.byIds;
    this.limit = props.limit;
    this.fave = props.fave;
    this.archived = props.archived;
  }
}
