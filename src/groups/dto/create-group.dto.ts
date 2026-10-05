import { IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  code: string

  @IsString()
  @IsOptional()
  description?: string
}