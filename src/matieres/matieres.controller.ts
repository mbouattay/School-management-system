import { Controller, Post, Body, Get, Param, Put, Delete } from "@nestjs/common";
import { MatieresService } from "./matieres.service";
import { CreateMatiereDto } from "./dtos/createMatiere.dto";
import { UpdateMatiereDto } from "./dtos/updateMatiere.dto";

@Controller('api/matieres')
export class MatieresController{
    constructor(private readonly matieresService: MatieresService) {}

    @Post()
    create(@Body() matiereData: CreateMatiereDto) {
        return this.matieresService.create(matiereData);
    }

    @Get()
    findAll() {
        return this.matieresService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.matieresService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() matiereData: UpdateMatiereDto) {
        return this.matieresService.update(id, matiereData);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.matieresService.remove(id);
        return { message: 'matiere supprimée avec succès' };
    }
}