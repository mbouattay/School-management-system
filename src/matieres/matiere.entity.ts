import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Seance } from "src/seances/seance.entity";
import { Note } from "../notes/note.entity";

@Entity({name:"matieres"})
export class Matiere {
    @PrimaryGeneratedColumn()
    id : number ; 
    @Column()
    nom : string ; 
    @Column()
    coefficient:number; 
    @Column()
    color :string ; 
    @OneToMany(() => Seance, seance => seance.matiere)
    seances: Seance[];

    @OneToMany(() => Note, note => note.matiere)
    notes: Note[];
}