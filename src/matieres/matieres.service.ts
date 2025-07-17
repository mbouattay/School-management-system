import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Matiere } from "./matiere.entity";
import { Repository } from "typeorm";
import { UpdateMatiereDto } from "./dtos/updateMatiere.dto";
import { CreateMatiereDto } from "./dtos/createMatiere.dto";

@Injectable()
export class MatieresService {
     constructor(@InjectRepository(Matiere) private matieresRepository: Repository<Matiere>){}

    async create(matiereData: CreateMatiereDto) {
        const matiere = this.matieresRepository.create(matiereData);
        return this.matieresRepository.save(matiere);
    }
    async findAll() {
        return this.matieresRepository.find();
    }

    async findOne(id: number) {
        return this.matieresRepository.findOne({ where: { id } });
    }

    async update(id: number, matiereData: UpdateMatiereDto) {
        await this.matieresRepository.update(id, matiereData);
        return this.findOne(id);
    }

    async remove(id: number) {
        return this.matieresRepository.delete(id);
    }
}