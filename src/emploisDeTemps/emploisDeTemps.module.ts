import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmploisDeTempsController } from "./emploisDeTemps.controller";
import { EmploisDeTempsService } from "./emploisDeTemps.service";
import { EmploiDeTemps } from "./emploiDeTemps.entity";
import { Classe } from "src/classes/classe.entity";

@Module({
    imports: [TypeOrmModule.forFeature([EmploiDeTemps, Classe])],
    controllers: [EmploisDeTempsController],
    providers: [EmploisDeTempsService],
})
export class EmploisDeTempsModule{}