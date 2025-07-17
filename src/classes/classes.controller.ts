import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClasseDto } from './dtos/createClasse.dto';
import { UpdateClasseDto } from './dtos/updateClasse.dto';

@Controller('api/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() classeData: ClasseDto) {
    return this.classesService.create(classeData);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.classesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() classeData: UpdateClasseDto) {
    return this.classesService.update(id, classeData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.classesService.remove(id);
    return { message: 'Classe supprimée avec succès' };
  }
}
