import { Injectable, NotFoundException } from "@nestjs/common";
import { Bulletin } from "./bulletin.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Etudiant } from "../users/etudiant.entity";
import { Note } from "../notes/note.entity";
import { Matiere } from "../matieres/matiere.entity";

@Injectable()
export class BulletinService {
    @InjectRepository(Bulletin) private emploisRepository: Repository<Bulletin>;
    @InjectRepository(Etudiant) private etudiantRepository: Repository<Etudiant>;
    @InjectRepository(Note) private noteRepository: Repository<Note>;
    @InjectRepository(Matiere) private matiereRepository: Repository<Matiere>;

    async getBulletinForEtudiant(etudiantId: number, trimester: string) {
        // 1. Check if bulletin exists
        const bulletin = await this.emploisRepository.findOne({
            where: { etudiant: { id: etudiantId }, trimester },
            relations: ['etudiant'],
        });
        if (bulletin){
            // Get notes for this student and trimester
            const notes = await this.noteRepository.find({
                where: { etudiant: { id: etudiantId }, trimester },
                relations: ['matiere'],
            });
            // Group notes by matiere
            const matieresMap = new Map<number, { matiere: Matiere, notes: Note[] }>();
            for (const note of notes) {
                if (!matieresMap.has(note.matiere.id)) {
                    matieresMap.set(note.matiere.id, { matiere: note.matiere, notes: [] });
                }
                matieresMap.get(note.matiere.id)!.notes.push(note);
            }
            const modules: { matiere: string; notes: { id: number; note: number; type: string }[]; moyenneModulaire: number }[] = [];
            for (const { matiere, notes } of matieresMap.values()) {
                const sum = notes.reduce((acc, n) => acc + n.note * n.coefficient, 0);
                const coeff = notes.reduce((acc, n) => acc + n.coefficient, 0);
                const moyenne = coeff > 0 ? sum / coeff : 0;
                modules.push({
                    matiere: matiere.nom,
                    notes: notes.map(n => ({ id: n.id, note: n.note, type: n.type })),
                    moyenneModulaire: moyenne,
                });
            }
            return {
                ...bulletin,
                etudiant: bulletin.etudiant,
                modules,
            };
        }
        // 2. Get student and notes
        const etudiant = await this.etudiantRepository.findOne({ where: { id: etudiantId }, relations: ['notes'] });
        if (!etudiant) throw new NotFoundException('Etudiant not found');
        const notes = await this.noteRepository.find({
            where: { etudiant: { id: etudiantId }, trimester },
            relations: ['matiere'],
        });
        if (notes.length === 0) throw new NotFoundException('Aucune note pour ce trimestre');
        // Get all matieres for the student's class
        await this.etudiantRepository.findOne({ where: { id: etudiantId }, relations: ['classe'] });
        const classe = etudiant.classe;
        // Find all matieres for this class via seances (emploi de temps)
        const seances = await this.matiereRepository.manager.find('Seance', { where: { emploiDeTemps: { classe: { id: classe.id } } }, relations: ['matiere', 'emploiDeTemps', 'emploiDeTemps.classe'] });
        const matieresClasseSet = new Set<number>();
        for (const seance of seances) {
            if (seance['matiere'] && seance['matiere'].id) {
                matieresClasseSet.add(seance['matiere'].id);
            }
        }
        // 3. Calculate module averages
        const matieresMap = new Map<number, { matiere: Matiere, notes: Note[] }>();
        for (const note of notes) {
            if (!matieresMap.has(note.matiere.id)) {
                matieresMap.set(note.matiere.id, { matiere: note.matiere, notes: [] });
            }
            matieresMap.get(note.matiere.id)!.notes.push(note);
        }
        const modules: { matiere: string; notes: { id: number; note: number; type: string }[]; moyenneModulaire: number }[] = [];
        let total = 0;
        let totalCoeff = 0;
        for (const { matiere, notes } of matieresMap.values()) {
            const sum = notes.reduce((acc, n) => acc + n.note * n.coefficient, 0);
            const coeff = notes.reduce((acc, n) => acc + n.coefficient, 0);
            const moyenne = coeff > 0 ? sum / coeff : 0;
            modules.push({
                matiere: matiere.nom,
                notes: notes.map(n => ({ id: n.id, note: n.note, type: n.type })),
                moyenneModulaire: moyenne,
            });
            total += moyenne * matiere.coefficient;
            totalCoeff += matiere.coefficient;
        }
        // Condition: only calculate general average if all class subjects have notes
        if (matieresMap.size !== matieresClasseSet.size) {
            return {
                etudiant: {
                    id: etudiant.id,
                    nom: etudiant.nom,
                    prenom: etudiant.prenom,
                },
                modules,
                message: 'Notes manquantes pour certaines matières de la classe',
            };
        }
        const moyenneGenerale = totalCoeff > 0 ? total / totalCoeff : 0;
        const resultat = moyenneGenerale < 10 ? 'refuse' : 'admis';
        // 4. Return the structure
        return {
            etudiant: {
                id: etudiant.id,
                nom: etudiant.nom,
                prenom: etudiant.prenom,
            },
            modules,
            moyenneGenerale,
            resultat,
        };
    }

    async getAllBulletinsByClasseAndTrimester(classeId: number, trimester: string) {
        // Get all students in the class
        const etudiants = await this.etudiantRepository.find({ where: { classe: { id: classeId } } });
        const results: { etudiant: { id: number; nom: string; prenom: string }; moyenneGenerale: number | null; modules: { matiere: string; notes: { id: number; note: number; type: string }[]; moyenneModulaire: number }[] }[] = [];
        for (const etudiant of etudiants) {
            // Try to get the bulletin
            let bulletin = await this.emploisRepository.findOne({ where: { etudiant: { id: etudiant.id }, trimester }, relations: ['etudiant'] });
            let modules: { matiere: string; notes: { id: number; note: number; type: string }[]; moyenneModulaire: number }[] = [];
            let moyenneGenerale: number | null = null;
            if (bulletin) {
                moyenneGenerale = bulletin.moyenneGeneal;
            } else {
                // Calculate as in getBulletinForEtudiant
                const notes = await this.noteRepository.find({ where: { etudiant: { id: etudiant.id }, trimester }, relations: ['matiere'] });
                // Get all matieres for the student's class
                const seances = await this.matiereRepository.manager.find('Seance', { where: { emploiDeTemps: { classe: { id: classeId } } }, relations: ['matiere', 'emploiDeTemps', 'emploiDeTemps.classe'] });
                const matieresClasseSet = new Set<number>();
                for (const seance of seances) {
                    if (seance['matiere'] && seance['matiere'].id) {
                        matieresClasseSet.add(seance['matiere'].id);
                    }
                }
                const matieresMap = new Map<number, { matiere: Matiere, notes: Note[] }>();
                for (const note of notes) {
                    if (!matieresMap.has(note.matiere.id)) {
                        matieresMap.set(note.matiere.id, { matiere: note.matiere, notes: [] });
                    }
                    matieresMap.get(note.matiere.id)!.notes.push(note);
                }
                modules = [];
                let total = 0;
                let totalCoeff = 0;
                for (const { matiere, notes } of matieresMap.values()) {
                    const sum = notes.reduce((acc, n) => acc + n.note * n.coefficient, 0);
                    const coeff = notes.reduce((acc, n) => acc + n.coefficient, 0);
                    const moyenne = coeff > 0 ? sum / coeff : 0;
                    modules.push({
                        matiere: matiere.nom,
                        notes: notes.map(n => ({ id: n.id, note: n.note, type: n.type })),
                        moyenneModulaire: moyenne,
                    });
                    total += moyenne * matiere.coefficient;
                    totalCoeff += matiere.coefficient;
                }
                if (matieresMap.size === matieresClasseSet.size && totalCoeff > 0) {
                    moyenneGenerale = total / totalCoeff;
                }
            }
            results.push({
                etudiant: {
                    id: etudiant.id,
                    nom: etudiant.nom,
                    prenom: etudiant.prenom,
                },
                moyenneGenerale,
                modules,
            });
        }
        return results;
    }

    async getStatsMoyenneGeneraleByClasseAndTrimester(classeId: number, trimester: string) {
        const bulletins = await this.getAllBulletinsByClasseAndTrimester(classeId, trimester);
        // Filter only those with a calculable moyenneGenerale (not null)
        const moyennes = bulletins
            .map(b => b.moyenneGenerale)
            .filter((m): m is number => typeof m === 'number');
        if (moyennes.length === 0) {
            return { min: null, max: null, avg: null };
        }
        const min = Math.min(...moyennes);
        const max = Math.max(...moyennes);
        const avg = moyennes.reduce((a, b) => a + b, 0) / moyennes.length;
        return { min, max, avg };
    }
}