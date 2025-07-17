import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSeanceDto {
    @IsOptional()
    @IsString()
    jour?: string;

    @IsOptional()
    @IsString()
    heureDeDebut?: string;

    @IsOptional()
    @IsString()
    heureDeFin?: string;

    @IsOptional()
    @IsString()
    salle?: string;

    @IsOptional()
    @IsNumber()
    emploiDeTempsId?: number;

    @IsOptional()
    @IsNumber()
    matiereId?: number;

    @IsOptional()
    @IsNumber()
    enseignantId?: number;
} 