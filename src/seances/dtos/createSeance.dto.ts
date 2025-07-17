import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSeanceDto {
    @IsNotEmpty()
    @IsString()
    jour: string;

    @IsNotEmpty()
    @IsString()
    heureDeDebut: string;

    @IsNotEmpty()
    @IsString()
    heureDeFin: string;

    @IsNotEmpty()
    @IsString()
    salle: string;

    @IsNotEmpty()
    @IsNumber()
    emploiDeTempsId: number;

    @IsNotEmpty()
    @IsNumber()
    matiereId: number;

    @IsNotEmpty()
    @IsNumber()
    enseignantId: number;
} 