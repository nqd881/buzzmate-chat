import { Query, QueryProps } from "@libs/ddd";

export class FindUsersQuery extends Query {
  public readonly limit?: number;
  public readonly byIds?: string[];
  public readonly byEmails?: string[];
  public readonly byNames?: string[];

  constructor(props: QueryProps<FindUsersQuery>) {
    super(props);

    this.limit = props?.limit;
    this.byIds = props?.byIds;
    this.byEmails = props?.byEmails;
    this.byNames = props?.byNames;
  }
}
