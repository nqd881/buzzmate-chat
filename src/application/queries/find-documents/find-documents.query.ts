import { Query, QueryProps } from "@libs/ddd";

export class FindDocumentsQuery extends Query {
  public readonly byIds: string[];

  constructor(props: QueryProps<FindDocumentsQuery>) {
    super(props);

    this.byIds = props.byIds;
  }
}
