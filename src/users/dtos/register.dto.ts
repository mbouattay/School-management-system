import { IsEmail, IsEnum, IsNotEmpty,IsString, MinLength, IsDateString, IsInt, IsOptional } from 'class-validator';
import { UserType } from '../../utils/enums';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  prenom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserType)
  role: UserType;

  @IsOptional()
  @IsString()
  matricule?: string;

  @IsOptional()
  @IsDateString()
  dateDeNaissance?: string;

  @IsInt()
  @IsOptional()
  classeId?: number;

  @IsOptional()
  @IsString()
  specialite?: string;

}



