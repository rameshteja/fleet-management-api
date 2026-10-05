import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code: string

  @IsString()
  @IsOptional()
  description?: string
}