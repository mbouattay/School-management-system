import { IsNumber, IsOptional, IsString,  } from "class-validator"

export class UpdateClasseDto {
    @IsOptional()
    @IsString()
    nom ?: string
    @IsOptional()
    @IsString()
    niveau ?:string
    @IsOptional()
    @IsNumber()
    capacite_max ?:number
}