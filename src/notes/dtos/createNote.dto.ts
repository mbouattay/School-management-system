import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { noteType } from 'src/utils/enums';

export class CreateNoteDto {
  @IsNumber()
  @IsNotEmpty()
  note: number;

  @IsNumber()
  @IsNotEmpty()
  coefficient: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(noteType)
  type: string;

  @IsNumber()
  @IsNotEmpty()
  matiereId: number;

  @IsNumber()
  @IsNotEmpty()
  etudiantId: number;

  @IsString()
  trimester: string;
} 