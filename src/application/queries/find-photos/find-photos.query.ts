import { Query, QueryProps } from "@libs/ddd";

export class FindPhotosQuery extends Query {
  public readonly byIds: string[];

  constructor(props: QueryProps<FindPhotosQuery>) {
    super(props);

    this.byIds = props.byIds;
  }
}
