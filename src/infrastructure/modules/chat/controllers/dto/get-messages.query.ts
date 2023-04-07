import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { parseInt } from "lodash";

export class GetMessagesQuery {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @IsString({ each: true })
  @IsOptional()
  ids: string[];

  @IsString()
  @IsOptional()
  before_message_id: string;

  @IsString()
  @IsOptional()
  after_message_id: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  before_time: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  after_time: number;
}
