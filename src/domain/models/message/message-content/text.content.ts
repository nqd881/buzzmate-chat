import { WebPage } from "@domain/models/webpage";
import { MessageContent } from "./interface/message-content";

export interface IMessageContentTextProps {
  text: string;
  webPage: WebPage;
}

export class MessageContentText extends MessageContent<IMessageContentTextProps> {
  constructor(props: IMessageContentTextProps) {
    super(props);
  }

  validate() {}

  get text() {
    return this.props.text;
  }

  get webPage() {
    return this.props.webPage;
  }

  static isTextContent(
    content: MessageContent<any>
  ): content is MessageContentText {
    return content instanceof MessageContentText;
  }

  hasFile() {
    return false;
  }

  getFile() {
    return null;
  }
}
