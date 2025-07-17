import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMatiereDto {
    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsNotEmpty()
    @IsNumber()
    coefficient: number;

    @IsNotEmpty()
    @IsString()
    color: string;
}