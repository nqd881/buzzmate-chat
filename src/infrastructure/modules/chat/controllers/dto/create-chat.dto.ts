import {IsString} from "class-validator";

export class CreateChatRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString({each: true})
  memberUserIds: string[];
}
