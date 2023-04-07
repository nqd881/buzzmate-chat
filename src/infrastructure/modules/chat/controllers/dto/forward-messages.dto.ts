import {IsString} from "class-validator";

export class ForwardMessageRequestDto {
  @IsString()
  toChatId: string;
}

export class ForwardMessagesRequestDto {
  @IsString()
  toChatId: string;

  @IsString({each: true})
  messageIds: string[];
}
