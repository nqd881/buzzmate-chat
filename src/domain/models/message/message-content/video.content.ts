import {VideoId} from "@domain/models/video/video";
import {MessageContent, MessageContentProps} from "../message-content";

export interface IMessageContentVideoProps {
  caption: string;
  videoId: VideoId;
}

export class MessageContentVideo extends MessageContent<IMessageContentVideoProps> {
  constructor(props: MessageContentProps<IMessageContentVideoProps>) {
    super(props);
  }

  protected validate(): void {}

  get caption() {
    return this.props.caption;
  }

  get videoId() {
    return this.props.videoId;
  }
}
