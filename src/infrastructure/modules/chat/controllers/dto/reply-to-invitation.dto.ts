import { IsBoolean } from "class-validator";

export class ReplyToInvitationRequestDto {
  @IsBoolean()
  accept: boolean;
}
