import {PhotoId} from "@domain/models/photo/photo";
import {MessageContent, MessageContentProps} from "../message-content";

export interface IMessageContentPhotoProps {
  caption: string;
  photoId: PhotoId;
}

export class MessageContentPhoto extends MessageContent<IMessageContentPhotoProps> {
  constructor(props: MessageContentProps<IMessageContentPhotoProps>) {
    super(props);
  }

  protected validate(): void {}

  get caption() {
    return this.props.caption;
  }

  get photoId() {
    return this.props.photoId;
  }
}
