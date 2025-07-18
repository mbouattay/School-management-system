import { ChildEntity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../utils/enums';
import { Classe } from '../classes/classe.entity';
import { Note } from '../notes/note.entity';
import { Bulletin } from '../bulletins/bulletin.entity';

@ChildEntity(UserType.ETUDIANT)
export class Etudiant extends User{
  @Column()
  matricule: string;
  @Column()
  dateDeNaissance:Date;
  @ManyToOne(() => Classe, classe => classe.etudiants)
  classe: Classe;
  @OneToMany(() => Note, note => note.etudiant)
  notes: Note[];
  @OneToMany(() => Bulletin, bulletin => bulletin.etudiant)
  bulletins: Bulletin[];
}