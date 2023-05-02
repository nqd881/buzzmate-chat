import { PhotoId } from "@domain/models/photo/photo";
import { DomainEvent, DomainEventProps } from "@libs/ddd";

export class PhotoCreatedDomainEvent extends DomainEvent<PhotoCreatedDomainEvent> {
  public readonly photoId: PhotoId;

  constructor(props: DomainEventProps<PhotoCreatedDomainEvent>) {
    super(props);

    this.photoId = props.photoId;
  }
}
