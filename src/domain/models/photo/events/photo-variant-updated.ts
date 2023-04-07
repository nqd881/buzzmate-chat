import {PhotoId} from "@domain/models/photo/photo";
import {PhotoSize, PhotoSizeType} from "@domain/models/photo/photo-size";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class PhotoVariantsUpdatedDomainEvent extends DomainEvent<PhotoVariantsUpdatedDomainEvent> {
  public readonly photoId: PhotoId;
  public readonly variantSizeType: PhotoSizeType;
  public readonly variantPhotoSize: PhotoSize;

  constructor(props: DomainEventProps<PhotoVariantsUpdatedDomainEvent>) {
    super(props);

    this.photoId = props.photoId;
    this.variantSizeType = props.variantSizeType;
    this.variantPhotoSize = props.variantPhotoSize;
  }
}
