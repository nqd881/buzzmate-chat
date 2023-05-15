import { Video } from "@domain/models/video";
import { MessageContent } from "./interface/message-content";

export interface IMessageContentVideoProps {
  caption: string;
  video: Video;
}

export class MessageContentVideo extends MessageContent<IMessageContentVideoProps> {
  constructor(props: IMessageContentVideoProps) {
    super(props);
  }

  validate() {}

  get caption() {
    return this.props.caption;
  }

  get video() {
    return this.props.video;
  }

  static isVideoContent(
    content: MessageContent<any>
  ): content is MessageContentVideo {
    return content instanceof MessageContentVideo;
  }

  hasFile() {
    return true;
  }

  getFile() {
    return this.video.file;
  }
}
