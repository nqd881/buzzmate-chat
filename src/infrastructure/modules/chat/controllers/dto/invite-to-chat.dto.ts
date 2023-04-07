import { IsString } from "class-validator";

export class InviteToChatRequestDto {
  @IsString()
  chatId: string;

  @IsString({ each: true })
  userIds: string[];
}
