import {AggregateRoot, EntityId} from "@libs/ddd";
import {FileCreatedDomainEvent} from "./events/file-created";

export interface IFileProps {
  name: string;
  size: number;
  mimetype: string;
  date: Date;
  url: string;
}

export class FileId extends EntityId {}

export class File extends AggregateRoot<FileId, IFileProps> {
  protected _name: string;
  protected _mimetype: string;
  protected _size: number;
  protected _url: string;
  protected _date: Date;

  constructor(props: IFileProps, version: number, id?: FileId) {
    super(props, version, id);
  }

  protected get IdConstructor() {
    return FileId;
  }

  protected init() {
    this._name = this.props.name;
    this._mimetype = this.props.mimetype;
    this._size = this.props.size;
    this._url = this.props.url;
    this._date = this.props.date;
  }

  protected validateProps() {}

  validate() {}

  static create(props: IFileProps) {
    const newFile = new File(props, 0);

    newFile.addEvent(
      new FileCreatedDomainEvent({
        aggregateId: newFile.id,
        fileId: newFile.id,
        name: newFile.name,
        mimetype: newFile.mimetype,
      })
    );

    return newFile;
  }

  get name() {
    return this._name;
  }

  get mimetype() {
    return this._mimetype;
  }

  get size() {
    return this._size;
  }

  get date() {
    return this._date;
  }

  get url() {
    return this._url;
  }
}
