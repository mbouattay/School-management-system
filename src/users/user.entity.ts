import { UserType } from '../utils/enums';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";

@Entity({ name: 'users' })
@TableInheritance({ column: { type: 'varchar', name: 'role' } })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nom: string;
    @Column()
    prenom: string;
    @Column({ type: 'varchar', length: '250', unique: true })
    email: string;
    @Column()
    password: string;
    @Column({ type: 'enum', enum: UserType, default: UserType.ETUDIANT })
    role: UserType;
    @Column({ default: false })
    isAccountVerified: boolean;
    @Column({ nullable: true })
    verificationToken: string;
    @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}