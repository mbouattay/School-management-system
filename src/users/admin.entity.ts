import { ChildEntity, Column} from 'typeorm';
import { User } from './user.entity';
import { UserType } from '../utils/enums';
@ChildEntity(UserType.ADMIN)
export class Admin extends User {
  @Column()
  grade:string;
}