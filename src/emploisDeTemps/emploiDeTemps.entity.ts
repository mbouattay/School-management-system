import { CURRENT_TIMESTAMP } from "src/utils/constants";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, OneToMany } from "typeorm";
import { Classe } from "src/classes/classe.entity";
import { Seance } from "src/seances/seance.entity";

@Entity({name:"emploisDeTemps"})
export class EmploiDeTemps {
    @PrimaryGeneratedColumn()
    id:number;
    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;

    @OneToOne(() => Classe, classe => classe.emploiDeTemps)
    classe: Classe;

    @OneToMany(() => Seance, seance => seance.emploiDeTemps)
    seances: Seance[];
}