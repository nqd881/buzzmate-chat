import {Guard} from "./guard";
import {v4 as uuidv4} from "uuid";
import _ from "lodash";

export type CommandProps<T extends Command<T>> = Omit<T, "id" | "metadata"> &
  Partial<Command<T>>;

export interface CommandMetadata {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly userId?: string;
  readonly timestamp?: number;
}

export class Command<T extends Command<T> = any> {
  private static get DEFAULT_METADATA(): CommandMetadata {
    return {
      correlationId: null,
      causationId: null,
      userId: null,
      timestamp: Date.now(),
    };
  }

  readonly id: string;

  readonly metadata: CommandMetadata;

  constructor(props: CommandProps<T>) {
    if (Guard.isEmpty(props)) {
      throw new Error("Command props should not be empty");
    }

    this.id = props.id ?? uuidv4();
    this.metadata = _.merge(Command.DEFAULT_METADATA, props.metadata);
  }
}
