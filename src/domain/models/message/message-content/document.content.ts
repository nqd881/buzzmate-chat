import { Document } from "@domain/models/document";
import { MessageContent } from "./interface/message-content";

export interface IMessageContentDocumentProps {
  caption: string;
  document: Document;
}

export class MessageContentDocument extends MessageContent<IMessageContentDocumentProps> {
  constructor(props: IMessageContentDocumentProps) {
    super(props);
  }

  validate() {}

  get caption() {
    return this.props.caption;
  }

  get document() {
    return this.props.document;
  }

  static isDocumentContent(
    content: MessageContent<any>
  ): content is MessageContentDocument {
    return content instanceof MessageContentDocument;
  }

  hasFile() {
    return true;
  }

  getFile() {
    return this.document.file;
  }
}
