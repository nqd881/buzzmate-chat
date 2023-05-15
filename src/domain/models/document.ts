import { ValueObject } from "@libs/ddd";
import { File } from "./file";

export interface IDocumentProps {
  file: File;
}

export class Document extends ValueObject<IDocumentProps> {
  constructor(props: IDocumentProps) {
    super(props);
  }

  validate() {}

  get file() {
    return this.props.file;
  }
}
