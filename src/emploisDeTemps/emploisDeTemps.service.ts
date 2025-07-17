import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EmploiDeTemps } from "./emploiDeTemps.entity";
import { Repository } from "typeorm";
import { Classe } from "src/classes/classe.entity";

@Injectable()
export class EmploisDeTempsService {
    constructor(
        @InjectRepository(EmploiDeTemps) private emploisRepository: Repository<EmploiDeTemps>,
        @InjectRepository(Classe) private classesRepository: Repository<Classe>
    ){}

    async getAndCreateEmploi(classeId: number) {
        // On cherche la classe avec son emploi de temps et ses séances
        let classe = await this.classesRepository.findOne({
            where: { id: classeId },
            relations: ['emploiDeTemps', 'emploiDeTemps.seances']
        });
        if (!classe) throw new Error('Classe not found');
        if (classe.emploiDeTemps) {
            // Ajout du nom de la classe à la réponse
            return {
                ...classe.emploiDeTemps,
                nomClasse: classe.nom
            };
        }
        // Créer un nouvel emploi de temps et le lier à la classe
        const newEmploi = this.emploisRepository.create({ classe });
        await this.emploisRepository.save(newEmploi);
        classe.emploiDeTemps = newEmploi;
        await this.classesRepository.save(classe);
        // Charger les séances (sera vide)
        const emploi = await this.emploisRepository.findOne({
            where: { id: newEmploi.id },
            relations: ['seances']
        });
        return {
            ...emploi,
            nomClasse: classe.nom
        };
    }
}