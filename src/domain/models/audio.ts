import { ValueObject } from "@libs/ddd";
import { File } from "./file";

export interface IAudioProps {
  title: string;
  duration: number;
  file: File;
}

export class Audio extends ValueObject<IAudioProps> {
  constructor(props: IAudioProps) {
    super(props);
  }

  validate() {}

  get title() {
    return this.props.title;
  }

  get duration() {
    return this.props.duration;
  }

  get file() {
    return this.props.file;
  }
}
