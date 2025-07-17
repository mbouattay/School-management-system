import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { EmploiDeTemps } from "src/emploisDeTemps/emploiDeTemps.entity";
import { Matiere } from "src/matieres/matiere.entity";
import { Enseignant } from "src/users/enseignant.entity";

@Entity({name:"seances"})
export class Seance {
    @PrimaryGeneratedColumn()
    id:number ; 
    @Column()
    jour :string ; 
    @Column()
    heureDeDebut :  string ;
    @Column()
    heureDeFin :  string ;
    @Column()
    salle : string ;

    @ManyToOne(() => EmploiDeTemps, emploiDeTemps => emploiDeTemps.seances)
    emploiDeTemps: EmploiDeTemps;

    @ManyToOne(() => Matiere, matiere => matiere.seances)
    matiere: Matiere;

    @ManyToOne(() => Enseignant, enseignant => enseignant.seances)
    enseignant: Enseignant;
}