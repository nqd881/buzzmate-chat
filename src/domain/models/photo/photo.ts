import {AggregateRoot, EntityId} from "@libs/ddd";
import {ChatId} from "../chat/chat";
import {PhotoCreatedDomainEvent} from "./events/photo-created";
import {PhotoVariantsUpdatedDomainEvent} from "./events/photo-variant-updated";
import {PhotoSize, PhotoSizeType} from "./photo-size";

export interface IPhotoProps {
  chatId: ChatId;
  original: PhotoSize;
  variants: Map<PhotoSizeType, PhotoSize>;
}

export class PhotoId extends EntityId {}

export class Photo extends AggregateRoot<PhotoId, IPhotoProps> {
  protected _chatId: ChatId;
  protected _original: PhotoSize;
  protected _variants: Map<PhotoSizeType, PhotoSize>;

  constructor(props: IPhotoProps, version: number, id?: PhotoId) {
    super(props, version, id);
  }

  get IdConstructor() {
    return PhotoId;
  }

  protected init() {
    this._chatId = this.props.chatId;
    this._original = this.props.original;
    this._variants = this.props.variants || new Map();
  }

  validateProps() {}

  validate() {}

  static create(props: IPhotoProps) {
    const newPhoto = new Photo(props, 0);

    newPhoto.addEvent(
      new PhotoCreatedDomainEvent({
        aggregateId: newPhoto.id,
        chatId: newPhoto.chatId,
        photoId: newPhoto.id,
      })
    );

    return newPhoto;
  }

  get chatId() {
    return this._chatId;
  }

  get original() {
    return this._original;
  }

  get variants() {
    return this._variants;
  }

  updateVariant(sizeType: PhotoSizeType, photoSize: PhotoSize) {
    this._variants.set(sizeType, photoSize);

    this.addEvent(
      new PhotoVariantsUpdatedDomainEvent({
        aggregateId: this.id,
        photoId: this.id,
        variantSizeType: sizeType,
        variantPhotoSize: photoSize,
      })
    );
  }
}
