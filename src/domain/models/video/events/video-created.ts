import { VideoId } from "@domain/models/video/video";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class VideoCreatedDomainEvent extends DomainEvent<VideoCreatedDomainEvent> {
  public readonly videoId: VideoId;

  constructor(props: DomainEventProps<VideoCreatedDomainEvent>) {
    super(props);

    this.videoId = props.videoId;
  }
}
