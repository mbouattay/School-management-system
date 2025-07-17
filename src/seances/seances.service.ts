import { Injectable, NotFoundException } from "@nestjs/common";
import { Seance } from "./seance.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateSeanceDto } from "./dtos/createSeance.dto";
import { UpdateSeanceDto } from "./dtos/updateSeance.dto";
import { EmploiDeTemps } from "src/emploisDeTemps/emploiDeTemps.entity";
import { Matiere } from "src/matieres/matiere.entity";
import { Enseignant } from "src/users/enseignant.entity";

@Injectable()
export class SeancesService {
    constructor(
        @InjectRepository(Seance) private seancesRepository: Repository<Seance>,
        @InjectRepository(EmploiDeTemps) private emploisRepository: Repository<EmploiDeTemps>,
        @InjectRepository(Matiere) private matieresRepository: Repository<Matiere>,
        @InjectRepository(Enseignant) private enseignantsRepository: Repository<Enseignant>
    ){}

    async create(createSeanceDto: CreateSeanceDto) {
        const { emploiDeTempsId, matiereId, enseignantId, ...seanceData } = createSeanceDto;
        
        const emploiDeTemps = await this.emploisRepository.findOne({ where: { id: emploiDeTempsId } });
        if (!emploiDeTemps) throw new NotFoundException('Emploi de temps not found');
        
        const matiere = await this.matieresRepository.findOne({ where: { id: matiereId } });
        if (!matiere) throw new NotFoundException('Matiere not found');
        
        const enseignant = await this.enseignantsRepository.findOne({ where: { id: enseignantId } });
        if (!enseignant) throw new NotFoundException('Enseignant not found');

        const seance = this.seancesRepository.create({
            ...seanceData,
            emploiDeTemps,
            matiere,
            enseignant
        });
        
        return this.seancesRepository.save(seance);
    }

    async findAll() {
        return this.seancesRepository.find({ 
            relations: ['emploiDeTemps', 'matiere', 'enseignant'] 
        });
    }

    async findOne(id: number) {
        const seance = await this.seancesRepository.findOne({ 
            where: { id },
            relations: ['emploiDeTemps', 'matiere', 'enseignant']
        });
        if (!seance) throw new NotFoundException('Seance not found');
        return seance;
    }

    async update(id: number, updateSeanceDto: UpdateSeanceDto) {
        const seance = await this.findOne(id);
        
        const { emploiDeTempsId, matiereId, enseignantId, ...seanceData } = updateSeanceDto;
        
        if (emploiDeTempsId) {
            const emploiDeTemps = await this.emploisRepository.findOne({ where: { id: emploiDeTempsId } });
            if (!emploiDeTemps) throw new NotFoundException('Emploi de temps not found');
            seance.emploiDeTemps = emploiDeTemps;
        }
        
        if (matiereId) {
            const matiere = await this.matieresRepository.findOne({ where: { id: matiereId } });
            if (!matiere) throw new NotFoundException('Matiere not found');
            seance.matiere = matiere;
        }
        
        if (enseignantId) {
            const enseignant = await this.enseignantsRepository.findOne({ where: { id: enseignantId } });
            if (!enseignant) throw new NotFoundException('Enseignant not found');
            seance.enseignant = enseignant;
        }

        Object.assign(seance, seanceData);
        return this.seancesRepository.save(seance);
    }

    async remove(id: number) {
        const seance = await this.findOne(id);
        await this.seancesRepository.remove(seance);
        return { message: 'Seance deleted successfully' };
    }
}