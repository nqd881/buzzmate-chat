import {Query, QueryProps} from "@libs/ddd";

export class FindMessagesQuery extends Query {
  public readonly chatId: string;
  public readonly ids?: string[];
  public readonly limit?: number;
  public readonly afterTime?: number | Date;
  public readonly beforeTime?: number | Date;
  public readonly afterMessageId?: string;
  public readonly beforeMessageId?: string;

  constructor(props: QueryProps<FindMessagesQuery>) {
    super(props);

    this.chatId = props.chatId;
    this.ids = props.ids;
    this.limit = props.limit;
    this.afterMessageId = props.afterMessageId;
    this.beforeMessageId = props.beforeMessageId;
    this.afterTime = props.afterTime;
    this.beforeTime = props.beforeTime;
  }
}
