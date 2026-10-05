import { ArrayNotEmpty, IsArray, IsUUID, Matches } from "class-validator";

export class AssignPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  permissions: string[]
}