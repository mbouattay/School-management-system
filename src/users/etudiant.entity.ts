import { ChildEntity, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../utils/enums';
import { Classe } from '../classes/classe.entity';

@ChildEntity(UserType.ETUDIANT)
export class Etudiant extends User{
  @Column()
  matricule: string;
  @Column()
  dateDeNaissance:Date;
  @ManyToOne(() => Classe, classe => classe.etudiants)
  classe: Classe;
}