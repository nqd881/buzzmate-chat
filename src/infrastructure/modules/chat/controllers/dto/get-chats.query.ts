import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class GetChatsQuery {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @IsString({ each: true })
  @IsOptional()
  ids: string[];

  @IsString({ each: true })
  @IsOptional()
  excludeIds: string[];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  personal: boolean;
}
