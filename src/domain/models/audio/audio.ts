import { AggregateRoot, EntityId } from "@libs/ddd";

export interface IAudioProps {
  title: string;
  duration: number;
  file;
}

export class AudioId extends EntityId {}

export class Audio extends AggregateRoot<AudioId, IAudioProps> {
  constructor(props: IAudioProps, version: number, id?: AudioId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return AudioId;
  }

  protected init() {}

  validateProps() {}

  validate() {}

  static create(props: IAudioProps) {}
}
