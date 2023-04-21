import { IsString } from "class-validator";

export class ForwardMessageRequestDto {
  @IsString()
  toChatId: string;
}
