import {FileId} from "@domain/models/file/file";
import {DomainEvent, DomainEventProps} from "@libs/ddd";

export class FileCreatedDomainEvent extends DomainEvent<FileCreatedDomainEvent> {
  public readonly fileId: FileId;
  public readonly name: string;
  public readonly mimetype: string;

  constructor(props: DomainEventProps<FileCreatedDomainEvent>) {
    super(props);

    this.fileId = props.fileId;
    this.name = props.name;
    this.mimetype = props.mimetype;
  }
}
