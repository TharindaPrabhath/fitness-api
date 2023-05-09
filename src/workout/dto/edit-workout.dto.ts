import { IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class EditWorkoutDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
