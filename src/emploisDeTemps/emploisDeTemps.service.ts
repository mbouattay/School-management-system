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
        // On cherche la classe avec son emploi de temps et ses séances (avec matières et enseignants)
        let classe = await this.classesRepository.findOne({
            where: { id: classeId },
            relations: [
                'emploiDeTemps', 
                'emploiDeTemps.seances',
                'emploiDeTemps.seances.matiere',
                'emploiDeTemps.seances.enseignant'
            ]
        });
        
        if (!classe) throw new Error('Classe not found');
        
        if (classe.emploiDeTemps) {
            // Mapper les séances avec les noms des matières et enseignants
            const seancesWithDetails = classe.emploiDeTemps.seances?.map(seance => ({
                id: seance.id,
                jour: seance.jour,
                heureDeDebut: seance.heureDeDebut,
                heureDeFin: seance.heureDeFin,
                salle: seance.salle,
                matiere: {
                    id: seance.matiere?.id,
                    nom: seance.matiere?.nom,
                    color: seance.matiere?.color,
                    coefficient: seance.matiere?.coefficient
                },
                enseignant: {
                    id: seance.enseignant?.id,
                    nom: seance.enseignant?.nom,
                    prenom: seance.enseignant?.prenom,
                    specialite: seance.enseignant?.specialite
                }
            })) || [];

            return {
                id: classe.emploiDeTemps.id,
                createdAt: classe.emploiDeTemps.createdAt,
                updatedAt: classe.emploiDeTemps.updatedAt,
                nomClasse: classe.nom,
                seances: seancesWithDetails
            };
        }
        
        // Créer un nouvel emploi de temps et le lier à la classe
        const newEmploi = this.emploisRepository.create({ classe });
        await this.emploisRepository.save(newEmploi);
        classe.emploiDeTemps = newEmploi;
        await this.classesRepository.save(classe);
        
        // Charger les séances (sera vide) avec les relations
        const emploi = await this.emploisRepository.findOne({
            where: { id: newEmploi.id },
            relations: [
                'seances',
                'seances.matiere',
                'seances.enseignant'
            ]
        });
        
        if (!emploi) throw new Error('Failed to create emploi de temps');
        
        return {
            id: emploi.id,
            createdAt: emploi.createdAt,
            updatedAt: emploi.updatedAt,
            nomClasse: classe.nom,
            seances: [] // Vide car c'est un nouvel emploi de temps
        };
    }
}