import { IsOptional, IsString } from "class-validator";

export class SendMessageRequestDto {
  @IsString()
  @IsOptional()
  prepareMessageId: string;

  @IsString()
  @IsOptional()
  matchId: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsString()
  @IsOptional()
  replyToMessageId: string;
}
