import { IsOptional, IsString, IsNumber } from 'class-validator';
export class UpdateMatiereDto {
    @IsOptional()
    @IsString()
    nom?: string;
    @IsOptional()
    @IsNumber()
    coefficient?: number;
    @IsOptional()
    @IsString()
    color?: string;
}