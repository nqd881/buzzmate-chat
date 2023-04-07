import {Entity} from "./entity";

export type IdTypeOfEntity<E> = E extends Entity<infer Id, unknown>
  ? Id
  : never;
