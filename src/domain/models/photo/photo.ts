import { AggregateRoot, EntityId } from "@libs/ddd";
import { ChatId } from "../chat/chat";
import { FileId } from "../file/file";
import { PhotoCreatedDomainEvent } from "./events/photo-created";

export interface IPhotoProps {
  width: number;
  height: number;
  fileId: FileId;
}

export class PhotoId extends EntityId {}

export class Photo extends AggregateRoot<PhotoId, IPhotoProps> {
  protected _width: number;
  protected _height: number;
  protected _fileId: FileId;

  constructor(props: IPhotoProps, version: number, id?: PhotoId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return PhotoId;
  }

  protected init() {
    this._width = this.props.width;
    this._height = this.props.height;
    this._fileId = this.props.fileId;
  }

  validateProps() {}

  validate() {}

  static create(props: IPhotoProps) {
    const newPhoto = new Photo(props, 0);

    newPhoto.addEvent(
      new PhotoCreatedDomainEvent({
        aggregateId: newPhoto.id,
        photoId: newPhoto.id,
      })
    );

    return newPhoto;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get fileId() {
    return this._fileId;
  }
}
