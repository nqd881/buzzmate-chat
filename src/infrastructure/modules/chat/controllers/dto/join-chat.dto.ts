import { IsOptional, IsString } from "class-validator";

export class JoinChatRequestDto {
  @IsString()
  @IsOptional()
  key: string;
}
