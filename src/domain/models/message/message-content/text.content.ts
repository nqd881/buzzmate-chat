import {WebPage} from "@domain/models/webpage";
import {MessageContent, MessageContentProps} from "../message-content";

export interface IMessageContentTextProps {
  text: string;
  webPage: WebPage;
}

export class MessageContentText extends MessageContent<IMessageContentTextProps> {
  constructor(props: MessageContentProps<IMessageContentTextProps>) {
    super(props);
  }

  validate() {}

  get text() {
    return this.props.text;
  }

  get webPage() {
    return this.props.webPage;
  }
}
