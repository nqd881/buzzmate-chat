import { ValueObject } from "@libs/ddd";
import { File } from "./file";

export interface IPhotoProps {
  width: number;
  height: number;
  file: File;
}

export class Photo extends ValueObject<IPhotoProps> {
  constructor(props: IPhotoProps) {
    super(props);
  }

  validate() {}

  get width() {
    return this.props.width;
  }

  get height() {
    return this.props.height;
  }

  get file() {
    return this.props.file;
  }
}
