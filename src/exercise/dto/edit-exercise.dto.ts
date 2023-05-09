import { IsOptional, IsString } from 'class-validator';

export class EdiExerciseDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  description: string;
}
