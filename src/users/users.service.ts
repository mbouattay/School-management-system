import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { Etudiant } from "./etudiant.entity";
import { Enseignant } from "./enseignant.entity";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { Classe } from "../classes/classe.entity";

import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dtos/login.dto";
import { JWTPayloadType } from "src/utils/types";
import { MailService } from "src/mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "node:crypto"
import { UpdateEtudiantDto } from "./dtos/updateEtudiant.dto";
import { UpdateEnseignantDto } from "./dtos/updateEnseignant.dto";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Etudiant)
        private etudiantRepository: Repository<Etudiant>,
        @InjectRepository(Enseignant)
        private enseignantRepository: Repository<Enseignant>,
        @InjectRepository(Classe)
        private classeRepository: Repository<Classe>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly config: ConfigService
    ){}

    public async register (registerDto : RegisterDto){
        const {role} = registerDto;
        if(role === 'etudiant') {
            return this.createEtudiant(registerDto);
        }  else if (role === 'enseignant'){
            return this.createEnseignant(registerDto);
        } else{
                return this.createAdmin(registerDto)
        }
    }

    public async createEtudiant(registerDto: RegisterDto) {
        const {email,nom,prenom,role,matricule,dateDeNaissance,classeId}=registerDto ;
        const userFromDb = await this.userRepository.findOne({where:{email}});
        if(userFromDb) throw new BadRequestException("user already exist ") ; 
        const password =randomBytes(32).toString('hex')
        const hashedPassword = await this.hashPassword(password)
        let classe: Classe | undefined = undefined;
        if (classeId) {
            const foundClasse = await this.classeRepository.findOne({ where: { id: classeId } });
            if(!foundClasse) throw new BadRequestException('Classe not found');
            classe = foundClasse;
        }
        let newEtudiant = this.etudiantRepository.create({
            email,
            nom,
            prenom,
            password: hashedPassword,
            role,
            verificationToken: randomBytes(32).toString('hex'),
            matricule,
            dateDeNaissance,
            classe
        });
        newEtudiant = await this.etudiantRepository.save(newEtudiant);
        const link = this.generateLink(newEtudiant.id,newEtudiant.verificationToken)
        await this.mailService.sendVerifyEmailTemplate(email,link,password) ; 
        return { message: 'Verification token has been sent to your email, please verify your email address' };
    }

    public async createEnseignant(registerDto: RegisterDto) {
        const {email,nom,prenom,role,specialite} = registerDto;
        const userFromDb = await this.userRepository.findOne({where:{email}});
        if(userFromDb) throw new BadRequestException("user already exist ") ;
        const password =randomBytes(32).toString('hex') 
        const hashedPassword = await this.hashPassword(password)
        let newEnseignant = this.enseignantRepository.create({
            email,
            nom,
            prenom,
            password: hashedPassword,
            role,
            verificationToken: randomBytes(32).toString('hex'),
            specialite
        });
        newEnseignant = await this.enseignantRepository.save(newEnseignant);
        const link = this.generateLink(newEnseignant.id,newEnseignant.verificationToken)
        await this.mailService.sendVerifyEmailTemplate(email,link,password)
        return { message: 'Verification token has been sent to your email, please verify your email address' };
    }
    public async createAdmin(registerDto: RegisterDto) {
        const {email,nom,prenom,role} = registerDto;
        const userFromDb = await this.userRepository.findOne({where:{email}});
        if(userFromDb) throw new BadRequestException("user already exist ") ; 
        const password =randomBytes(32).toString('hex')
        const hashedPassword = await this.hashPassword(password)
        let newAdmin = this.userRepository.create({
            email,
            nom,
            prenom,
            password: hashedPassword,
            role,
            verificationToken: randomBytes(32).toString('hex'),
            
        });
        newAdmin = await this.userRepository.save(newAdmin);
        const link = this.generateLink(newAdmin.id,newAdmin.verificationToken)
        await this.mailService.sendVerifyEmailTemplate(email,link,password)
        return { message: 'Verification token has been sent to your email, please verify your email address' };
    }

    public async login (loginDto:LoginDto){
        const {email,password}=loginDto ; 
        const user = await this.userRepository.findOne({where:{email}}) ;
        if (!user)  throw new BadRequestException (" invalide email ") ;
        const isPasswordMatch = await bcrypt.compare (password, user.password) ; 
        if (!isPasswordMatch) throw new BadRequestException ("invalide password") ; 

        if (!user.isAccountVerified) {
            let verificationToken = user.verificationToken ;
            if (!verificationToken) {
                user.verificationToken = randomBytes(32).toString('hex');
                const result = await this.userRepository.save(user);
                verificationToken = result.verificationToken;
            }
            const link = this.generateLink(user.id, verificationToken);
            await this.mailService.sendVerifyEmailTemplate(email,link,password);
            return { message: 'Verification token has been sent to your email, please verify your email address' };
        }
        const accessToken = await this.generateJWT({ id: user.id, userType: user.role });
        return { accessToken };

    }

    public async verifyEmail (userId : number , verificationToken :string){
        const user = await this.getCurrentUser(userId) ; 
        if (!user) throw new NotFoundException("user not found");

        if(user.verificationToken === "null")
            throw new NotFoundException("there is no verification token");
      
          if(user.verificationToken !== verificationToken)
            throw new BadRequestException("invalid link");
          user.isAccountVerified = true;
          user.verificationToken = "null";
          await this.userRepository.save(user);
          return { message: "Your email has been verified, please log in to your account" };
          

    }
    public async getCurrentUser(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException("user not found");
        return user;
    }

    public async hashPassword(password: string){
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    private generateLink(userId: number, verificationToken: string) {
        return `${this.config.get<string>("DOMAIN")}/api/users/verify-email/${userId}/${verificationToken}`;
    }

    private generateJWT(payload: JWTPayloadType) {
        return this.jwtService.signAsync(payload);
    }

    public async updateEtudiant(id: number, updateDto: UpdateEtudiantDto) {
        const etudiant = await this.etudiantRepository.findOne({ where: { id } });
        if (!etudiant) throw new NotFoundException("Etudiant not found");

        if (updateDto.classeId) {
            const classe = await this.classeRepository.findOne({ where: { id: updateDto.classeId } });
            if (!classe) throw new NotFoundException("Classe not found");
            etudiant.classe = classe;
        }

       
        const { classeId, ...rest } = updateDto;
        Object.assign(etudiant, rest);

        return this.etudiantRepository.save(etudiant);
    }

    public async deleteEtudiant(id: number) {
        const etudiant = await this.etudiantRepository.findOne({ where: { id } });
        if (!etudiant) throw new NotFoundException("Etudiant not found");
        await this.etudiantRepository.remove(etudiant);
        return { message: "Etudiant deleted successfully" };
    }

    public async getAllEtudiants() {
        const etudiants = await this.etudiantRepository.find({ relations: ['classe'] });
        return etudiants.map(e => ({
            id: e.id,
            nom: e.nom,
            prenom: e.prenom,
            email: e.email,
            matricule: e.matricule,
            dateDeNaissance: e.dateDeNaissance,
            classe: e.classe ? e.classe.nom : null
        }));
    }

    public async searchUser(query: string, role: 'etudiant' | 'enseignant') {
        const repo = role === 'etudiant' ? this.etudiantRepository : this.enseignantRepository;
        return repo.createQueryBuilder('user')
            .where('user.nom LIKE :q OR user.prenom LIKE :q OR user.email LIKE :q', { q: `%${query}%` })
            .getMany();
    }

    public async searchEtudiant(query: string) {
        return this.searchUser(query, 'etudiant');
    }

    public async searchEnseignant(query: string) {
        return this.searchUser(query, 'enseignant');
    }

    public async updateEnseignant(id: number, updateDto: UpdateEnseignantDto) {
        const enseignant = await this.enseignantRepository.findOne({ where: { id } });
        if (!enseignant) throw new NotFoundException("Enseignant not found");
        if (updateDto.password) {
            updateDto.password = await this.hashPassword(updateDto.password);
        }
        Object.assign(enseignant, updateDto);
        return this.enseignantRepository.save(enseignant);
    }

    public async deleteEnseignant(id: number) {
        const enseignant = await this.enseignantRepository.findOne({ where: { id } });
        if (!enseignant) throw new NotFoundException("Enseignant not found");
        await this.enseignantRepository.remove(enseignant);
        return { message: "Enseignant deleted successfully" };
    }

    public async getAllEnseignants() {
        const enseignants = await this.enseignantRepository.find({ relations: ['seances', 'seances.emploiDeTemps', 'seances.emploiDeTemps.classe'] });
        return enseignants.map(e => {
        
            const classesMap = new Map();
            e.seances.forEach(seance => {
                const classe = seance.emploiDeTemps?.classe;
                if (classe) {
                    classesMap.set(classe.id, {
                        id: classe.id,
                        nom: classe.nom,
                        niveau: classe.niveau
                    });
                }
            });
            return {
                id: e.id,
                nom: e.nom,
                prenom: e.prenom,
                email: e.email,
                specialite: e.specialite,
                classes: Array.from(classesMap.values())
            };
        });
    }
}
