import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Matiere } from "../matieres/matiere.entity";
import { Etudiant } from "../users/etudiant.entity";
import { noteType } from "src/utils/enums";

@Entity({name:"notes"})
export class Note {
    @PrimaryGeneratedColumn()
    id:number ; 
    @Column()
    note:number ; 
    @Column()
    coefficient:number; 
    @Column({ type: 'enum', enum:noteType })
    type : string ; 
    @Column()
    trimester: string;
    @ManyToOne(() => Matiere, matiere => matiere.notes, { eager: true })
    matiere: Matiere;
    @ManyToOne(() => Etudiant, etudiant => etudiant.notes, { eager: true })
    etudiant: Etudiant;
}