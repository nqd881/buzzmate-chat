import {Guard} from "./guard";
import {v4 as uuidv4} from "uuid";
import _ from "lodash";

export type QueryProps<T extends Query<T>> = Omit<T, "id" | "metadata"> &
  Partial<Query<T>>;

export interface QueryMetadata {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly userId?: string;
  readonly timestamp?: number;
}

export class Query<T extends Query<T> = any> {
  private static get DEFAULT_METADATA(): QueryMetadata {
    return {
      correlationId: null,
      causationId: null,
      userId: null,
      timestamp: Date.now(),
    };
  }

  readonly id: string;

  readonly metadata: QueryMetadata;

  constructor(props: QueryProps<T>) {
    if (Guard.isEmpty(props)) {
      throw new Error("Query props should not be empty");
    }

    this.id = props.id ?? uuidv4();
    this.metadata = _.merge(Query.DEFAULT_METADATA, props.metadata);
  }
}
