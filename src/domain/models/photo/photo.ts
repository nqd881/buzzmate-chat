import { AggregateRoot, EntityId } from "@libs/ddd";
import { ChatId } from "../chat/chat";
import { FileId } from "../file/file";
import { PhotoCreatedDomainEvent } from "./events/photo-created";
import { IChatResource } from "../interfaces/chat-resource";

export interface IPhotoProps {
  chatId: ChatId;
  width: number;
  height: number;
  fileId: FileId;
}

export class PhotoId extends EntityId {}

export class Photo
  extends AggregateRoot<PhotoId, IPhotoProps>
  implements IChatResource
{
  protected _chatId: ChatId;
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
    this._chatId = this.props.chatId;
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
        chatId: newPhoto.chatId,
        photoId: newPhoto.id,
      })
    );

    return newPhoto;
  }

  get chatId() {
    return this._chatId;
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
