import { Audio } from "@domain/models/audio";
import { MessageContent } from "./interface/message-content";

export interface IMessageContentAudioProps {
  caption: string;
  audio: Audio;
}

export class MessageContentAudio extends MessageContent<IMessageContentAudioProps> {
  constructor(props: IMessageContentAudioProps) {
    super(props);
  }

  validate() {}

  get caption() {
    return this.props.caption;
  }

  get audio() {
    return this.props.audio;
  }

  static isAudioContent(
    content: MessageContent<any>
  ): content is MessageContentAudio {
    return content instanceof MessageContentAudio;
  }

  hasFile() {
    return true;
  }

  getFile() {
    return this.audio.file;
  }
}
