import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Note } from "./note.entity";
import { CreateNoteDto } from "./dtos/createNote.dto";
import { UpdateNoteDto } from "./dtos/updateNote.dto";
import { Matiere } from "../matieres/matiere.entity";
import { Etudiant } from "../users/etudiant.entity";

@Injectable()
export class NotesService {
    constructor (
        @InjectRepository(Note) private notesRepository: Repository<Note>,
        @InjectRepository(Matiere) private matiereRepository: Repository<Matiere>,
        @InjectRepository(Etudiant) private etudiantRepository: Repository<Etudiant>,
    ){}

    async create(createNoteDto: CreateNoteDto): Promise<Note> {
        const matiere = await this.matiereRepository.findOne({ where: { id: createNoteDto.matiereId } });
        if (!matiere) throw new NotFoundException('Matiere not found');
        const etudiant = await this.etudiantRepository.findOne({ where: { id: createNoteDto.etudiantId } });
        if (!etudiant) throw new NotFoundException('Etudiant not found');
        const note = this.notesRepository.create({
            note: createNoteDto.note,
            coefficient: createNoteDto.coefficient,
            type: createNoteDto.type,
            trimester: createNoteDto.trimester,
            matiere,
            etudiant,
        });
        return this.notesRepository.save(note);
    }

    async update(id: number, updateNoteDto: UpdateNoteDto) {
        const note = await this.notesRepository.findOne({ where: { id } });
        if (!note) throw new NotFoundException('Note not found');
        if (updateNoteDto.matiereId) {
            const matiere = await this.matiereRepository.findOne({ where: { id: updateNoteDto.matiereId } });
            if (!matiere) throw new NotFoundException('Matiere not found');
            note.matiere = matiere;
        }
        if (updateNoteDto.etudiantId) {
            const etudiant = await this.etudiantRepository.findOne({ where: { id: updateNoteDto.etudiantId } });
            if (!etudiant) throw new NotFoundException('Etudiant not found');
            note.etudiant = etudiant;
        }
        if (updateNoteDto.note !== undefined) note.note = updateNoteDto.note;
        if (updateNoteDto.coefficient !== undefined) note.coefficient = updateNoteDto.coefficient;
        if (updateNoteDto.type !== undefined) note.type = updateNoteDto.type;
        if (updateNoteDto.trimester !== undefined) note.trimester = updateNoteDto.trimester;
        return this.notesRepository.save(note);
    }

    async remove(id: number){
        const note = await this.notesRepository.findOne({ where: { id } });
        if (!note) throw new NotFoundException('Note not found');
        await this.notesRepository.remove(note);
    }

    

    async findByMatiereAndClasse(matiereId: number, classeId: number) {
        const notes = await this.notesRepository.find({
            relations: ['etudiant', 'matiere', 'etudiant.classe'],
            where: {
                matiere: { id: matiereId },
            },
        });
        // Filter notes by etudiant.classe.id
        const filteredNotes = notes.filter(note => note.etudiant && note.etudiant.classe && note.etudiant.classe.id === classeId);
        return filteredNotes.map(note => ({
            id: note.id,
            note: note.note,
            coefficient: note.coefficient,
            type: note.type,
            trimester: note.trimester,
            matiere: note.matiere,
            etudiant: {
                id: note.etudiant.id,
                nom: note.etudiant.nom,
                prenom: note.etudiant.prenom
            }
        }));
    }
}