import { ValueObject } from "@libs/ddd";

export interface IFileProps {
  name: string;
  size: number;
  mimetype: string;
}

export class File extends ValueObject<IFileProps> {
  constructor(props: IFileProps) {
    super(props);
  }

  validate() {}

  get name() {
    return this.props.name;
  }

  get size() {
    return this.props.size;
  }

  get mimetype() {
    return this.props.mimetype;
  }
}
