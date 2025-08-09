import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Bulletin } from "./bulletin.entity";
import { BulletinController } from "./bulletins.controller";
import { BulletinService } from "./bulletins.service";
import { Etudiant } from "../users/etudiant.entity";
import { Note } from "../notes/note.entity";
import { Matiere } from "../matieres/matiere.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Bulletin, Etudiant, Note, Matiere])
    ],
    controllers: [BulletinController],
    providers: [BulletinService],
    exports: [BulletinService]
})
export class BulletinsModule {}