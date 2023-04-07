import {IsString} from "class-validator";

export class HideMessagesRequestDto {
  @IsString({each: true})
  messageIds: string[];
}
