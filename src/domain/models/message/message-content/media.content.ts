import { DocumentId } from "@domain/models/document/document";
import { PhotoId } from "@domain/models/photo/photo";
import { VideoId } from "@domain/models/video/video";
import { MessageContent, MessageContentProps } from "../message-content";

export interface IMessageContentAlbumProps {
  caption: string;
  photoIds: PhotoId[];
  videoIds: VideoId[];
  documentIds: DocumentId[];
}

export class MessageContentMedia extends MessageContent<IMessageContentAlbumProps> {
  constructor(props: MessageContentProps<IMessageContentAlbumProps>) {
    super(props);
  }

  protected validate(): void {}

  get caption() {
    return this.props.caption;
  }

  get photoIds() {
    return this.props.photoIds;
  }

  get videoIds() {
    return this.props.videoIds;
  }

  get documentIds() {
    return this.props.documentIds;
  }

  static isMediaContent(
    content: MessageContent<any>
  ): content is MessageContentMedia {
    return content instanceof MessageContentMedia;
  }
}