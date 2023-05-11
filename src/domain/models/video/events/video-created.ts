import { ChatId } from "@domain/models/chat/chat";
import { VideoId } from "@domain/models/video/video";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class VideoCreatedDomainEvent extends DomainEvent<VideoCreatedDomainEvent> {
  public readonly chatId: ChatId;
  public readonly videoId: VideoId;

  constructor(props: DomainEventProps<VideoCreatedDomainEvent>) {
    super(props);

    this.chatId = props.chatId;
    this.videoId = props.videoId;
  }
}
