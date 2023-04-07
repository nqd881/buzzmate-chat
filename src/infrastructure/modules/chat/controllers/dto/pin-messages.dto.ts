import {IsBoolean, IsString} from "class-validator";

export class PinMessagesRequestDto {
  @IsString({each: true})
  messageIds: string[];

  @IsBoolean()
  shouldPin: boolean;
}

export class PinMessageRequestDto {
  @IsBoolean()
  shouldPin: boolean;
}
