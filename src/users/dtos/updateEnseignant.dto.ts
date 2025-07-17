import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { UserType } from "src/utils/enums";

export class UpdateEnseignantDto {
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
  } 