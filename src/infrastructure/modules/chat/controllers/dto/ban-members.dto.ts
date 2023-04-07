import { IsOptional, IsString } from "class-validator";

export class BanMembersRequestDto {
  @IsString({ each: true })
  memberIds: string[];

  @IsString()
  @IsOptional()
  reason: string;
}
