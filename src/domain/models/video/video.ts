import { VideoCreatedDomainEvent } from "@domain/models/video/events/video-created";
import {
  AggregateRoot,
  EntityId,
  ValueObject,
  ValueObjectProps,
} from "@libs/ddd";
import { ChatId } from "../chat/chat";
import { FileId } from "../file/file";
import { PhotoId } from "../photo/photo";
import { IChatResource } from "../interfaces/chat-resource";

export interface IThumbnailProps {
  photoId: PhotoId;
}

export class Thumbnail extends ValueObject<IThumbnailProps> {
  constructor(props: ValueObjectProps<IThumbnailProps>) {
    super(props);
  }

  validate() {}

  get photoId() {
    return this.props.photoId;
  }
}

export interface IVideoProps {
  chatId: ChatId;
  duration: number;
  width: number;
  height: number;
  thumbnail: Thumbnail;
  fileId: FileId;
}

export class VideoId extends EntityId {}

export class Video
  extends AggregateRoot<VideoId, IVideoProps>
  implements IChatResource
{
  protected _chatId: ChatId;
  protected _duration: number;
  protected _width: number;
  protected _height: number;
  protected _thumbnail: Thumbnail;
  protected _fileId: FileId;

  constructor(props: IVideoProps, version: number, id?: VideoId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return VideoId;
  }

  protected init() {
    this._chatId = this.props.chatId;
    this._duration = this.props.duration;
    this._width = this.props.width;
    this._height = this.props.height;
    this._thumbnail = this.props.thumbnail;
    this._fileId = this.props.fileId;
  }

  validateProps() {}

  validate() {}

  static create(props: IVideoProps) {
    const newVideo = new Video(props, 0);

    newVideo.addEvent(
      new VideoCreatedDomainEvent({
        aggregateId: newVideo.id,
        chatId: newVideo.chatId,
        videoId: newVideo.id,
      })
    );

    return newVideo;
  }

  get chatId() {
    return this._chatId;
  }

  get duration() {
    return this._duration;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get thumbnail() {
    return this._thumbnail;
  }

  get fileId() {
    return this._fileId;
  }
}
