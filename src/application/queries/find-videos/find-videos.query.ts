import { Query, QueryProps } from "@libs/ddd";

export class FindVideosQuery extends Query {
  public readonly byIds: string[];

  constructor(props: QueryProps<FindVideosQuery>) {
    super(props);

    this.byIds = props.byIds;
  }
}
