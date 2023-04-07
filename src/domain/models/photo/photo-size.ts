import {ValueObject, ValueObjectProps} from "@libs/ddd";
import {FileId} from "../file/file";

export type PhotoSizeType = string;

export interface IPhotoSizeProps {
  width: number;
  height: number;
  fileId: FileId;
}

export class PhotoSize extends ValueObject<IPhotoSizeProps> {
  constructor(props: ValueObjectProps<IPhotoSizeProps>) {
    super(props);
  }

  protected validate() {}

  get width() {
    return this.props.width;
  }

  get height() {
    return this.props.height;
  }

  get fileId() {
    return this.props.fileId;
  }
}
