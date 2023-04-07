import {DocumentId} from "@domain/models/document/document";
import {MessageContent, MessageContentProps} from "../message-content";

export interface IMessageContentDocumentProps {
  caption: string;
  documentId: DocumentId;
}

export class MessageContentDocument extends MessageContent<IMessageContentDocumentProps> {
  constructor(props: MessageContentProps<IMessageContentDocumentProps>) {
    super(props);
  }

  protected validate() {}

  get caption() {
    return this.props.caption;
  }

  get documentId() {
    return this.props.documentId;
  }
}
