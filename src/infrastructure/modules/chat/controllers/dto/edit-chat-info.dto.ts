import {IsOptional, IsString} from "class-validator";

export class EditChatInfoRequestDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
