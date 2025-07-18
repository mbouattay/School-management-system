import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./note.entity";
import { Matiere } from "../matieres/matiere.entity";
import { Etudiant } from "../users/etudiant.entity";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";

@Module({
    imports : [TypeOrmModule.forFeature([Note, Matiere, Etudiant])],
    providers: [NotesService],
    controllers: [NotesController],
})
export class NotesModule {}