import {IsString} from "class-validator";

export class SendReactionRequestDto {
  @IsString()
  reactionValue: string;
}
