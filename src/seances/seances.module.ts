import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seance } from "./seance.entity";
import { SeancesController } from "./seances.controller";
import { SeancesService } from "./seances.service";
import { EmploiDeTemps } from "src/emploisDeTemps/emploiDeTemps.entity";
import { Matiere } from "src/matieres/matiere.entity";
import { Enseignant } from "src/users/enseignant.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Seance, EmploiDeTemps, Matiere, Enseignant])],
    controllers: [SeancesController],
    providers: [SeancesService],
})
export class SeancesModule{}