import { Query, QueryProps } from "@libs/ddd";

export class FindPhotosQuery extends Query {
  public readonly chatId: string;
  public readonly byIds: string[];

  constructor(props: QueryProps<FindPhotosQuery>) {
    super(props);

    this.chatId = props.chatId;
    this.byIds = props.byIds;
  }
}
