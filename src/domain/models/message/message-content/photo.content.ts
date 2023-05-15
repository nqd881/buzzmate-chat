import { Photo } from "@domain/models/photo";
import { MessageContent } from "./interface/message-content";

export interface IMessageContentPhotoProps {
  caption: string;
  photo: Photo;
}

export class MessageContentPhoto extends MessageContent<IMessageContentPhotoProps> {
  constructor(props: IMessageContentPhotoProps) {
    super(props);
  }

  validate() {}

  get caption() {
    return this.props.caption;
  }

  get photo() {
    return this.props.photo;
  }

  static isPhotoContent(
    content: MessageContent<any>
  ): content is MessageContentPhoto {
    return content instanceof MessageContentPhoto;
  }

  hasFile() {
    return true;
  }

  getFile() {
    return this.photo.file;
  }
}
