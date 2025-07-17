import { IsNotEmpty, IsNumber, IsString, isString } from "class-validator"

export class ClasseDto {
    @IsNotEmpty()
    @IsString()
    nom:string
    @IsNotEmpty()
    @IsString()
    niveau :string
    @IsNotEmpty()
    @IsNumber()
    capacite_max :number
}