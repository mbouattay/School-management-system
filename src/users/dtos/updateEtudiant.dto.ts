import { IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { UserType } from "src/utils/enums";

export class UpdateEtudiantDto {
    @IsOptional()
    @IsString()
    nom?: string;
  
    @IsOptional()
    @IsString()
    prenom?: string;
  
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @IsDateString()
    dateDeNaissance?: string;
    @IsOptional()
    @IsString()
    password?: string;
  
    @IsOptional()
    @IsEnum(UserType)
    role?: UserType;
  
    @IsOptional()
    @IsString()
    specialite?: string;
  
    @IsOptional()
    @IsString()
    grade?: string;
  
    @IsOptional()
    @IsString()
    matricule?: string;
    @IsOptional()
    @IsInt()
    classeId?: number;
  }