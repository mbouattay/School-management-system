import { Controller, Post, Body, Put, Param, Delete, Get, Query } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dtos/createNote.dto";
import { UpdateNoteDto } from "./dtos/updateNote.dto";

@Controller('notes')
export class NotesController {
    constructor (private readonly notesService : NotesService){}
    @Post()
    create(@Body() createNoteDto: CreateNoteDto) {
        return this.notesService.create(createNoteDto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateNoteDto: UpdateNoteDto) {
        return this.notesService.update(id, updateNoteDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.notesService.remove(id);
    }
    @Get('by-matiere-classe')
    findByMatiereAndClasse(@Query('matiereId') matiereId: number, @Query('classeId') classeId: number) {
        return this.notesService.findByMatiereAndClasse(Number(matiereId), Number(classeId));
    }
}