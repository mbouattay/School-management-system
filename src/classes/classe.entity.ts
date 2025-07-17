import { CURRENT_TIMESTAMP } from "src/utils/constants";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Etudiant } from "src/users/etudiant.entity";
import { EmploiDeTemps } from "src/emploisDeTemps/emploiDeTemps.entity";

@Entity({name:"classes"})
export class Classe {
    @PrimaryGeneratedColumn()
    id:number 
    @Column()
    nom:string
    @Column()
    niveau :string
    @Column() 
    capacite_max :number
    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
    @OneToMany(() => Etudiant, etudiant => etudiant.classe)
    etudiants: Etudiant[];

    @OneToOne(() => EmploiDeTemps, { cascade: true })
    @JoinColumn()
    emploiDeTemps: EmploiDeTemps;
}