import { ValueObject } from "@libs/ddd";
import { File } from "./file";
import { Photo } from "./photo";

export interface IVideoProps {
  duration: number;
  height: number;
  width: number;
  thumbnail: Photo;
  file: File;
}

export class Video extends ValueObject<IVideoProps> {
  constructor(props: IVideoProps) {
    super(props);
  }

  validate() {}

  get duration() {
    return this.props.duration;
  }

  get width() {
    return this.props.width;
  }

  get height() {
    return this.props.height;
  }

  get thumbnail() {
    return this.props.thumbnail;
  }

  get file() {
    return this.props.file;
  }
}
