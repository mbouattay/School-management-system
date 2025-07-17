import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Classe } from "./classe.entity";
import { Repository } from "typeorm";
import { ClasseDto } from "./dtos/createClasse.dto";
import { UpdateClasseDto } from "./dtos/updateClasse.dto";

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Classe)
        private classesRepository: Repository<Classe>
    ){}

    async create(classeData: ClasseDto) {
        const classe = this.classesRepository.create(classeData);
        return this.classesRepository.save(classe);
    }

    async findAll() {
        const classes = await this.classesRepository.find({ relations: ['etudiants'] });
        return classes.map(classe => ({
            id: classe.id,
            nom: classe.nom,
            niveau: classe.niveau,
            capacite_max: classe.capacite_max,
            createdAt: classe.createdAt,
            updatedAt: classe.updatedAt,
            etudiants: classe.etudiants.map(e => ({
                id: e.id,
                nom: e.nom,
                prenom: e.prenom,
                email: e.email
            })),
            nombreEtudiants: classe.etudiants.length
        }));
    }

    async findOne(id: number) {
        return this.classesRepository.findOne({ where: { id } });
    }

    async update(id: number, classeData: UpdateClasseDto) {
        await this.classesRepository.update(id, classeData);
        return this.findOne(id);
    }
    async remove(id: number) {
        return this.classesRepository.delete(id);
    }
}