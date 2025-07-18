import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { noteType } from 'src/utils/enums';

export class UpdateNoteDto {
  @IsOptional()
  @IsNumber()
  note?: number;

  @IsOptional()
  @IsNumber()
  coefficient?: number;

  @IsOptional()
  @IsString()
  @IsEnum(noteType)
  type?: string;

  @IsOptional()
  @IsNumber()
  matiereId?: number;

  @IsOptional()
  @IsNumber()
  etudiantId?: number;
  @IsOptional()
  @IsString()
  trimester?: string;
} 