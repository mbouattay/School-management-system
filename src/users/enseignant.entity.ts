import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../utils/enums';
import { Seance } from "src/seances/seance.entity";
@ChildEntity(UserType.ENSEIGNANT)
export class Enseignant extends User {
  @Column()
  specialite:string;

  @OneToMany(() => Seance, seance => seance.enseignant)
  seances: Seance[];
}