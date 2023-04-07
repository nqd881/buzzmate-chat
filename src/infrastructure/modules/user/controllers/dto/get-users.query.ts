import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetUsersQuery {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @IsString({ each: true })
  @IsOptional()
  id: string[];

  @IsString({ each: true })
  @IsOptional()
  email: string[];

  @IsString({ each: true })
  @IsOptional()
  name: string[];
}
