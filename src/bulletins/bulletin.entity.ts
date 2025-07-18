import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Etudiant } from "../users/etudiant.entity";

@Entity({name:"bulletins"})
export class Bulletin {
    @PrimaryGeneratedColumn() 
    id:number ;
    @Column({type:'decimal'})
    moyenneGeneal : number ; 
    @Column()
    classement : string ; 
    @Column()
    appreciation :string ;
    @Column()
    resultat : string ; 
    @Column()
    trimester: string;
    @ManyToOne(() => Etudiant, etudiant => etudiant.bulletins)
    etudiant: Etudiant;
}