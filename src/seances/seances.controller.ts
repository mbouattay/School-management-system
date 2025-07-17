import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from "@nestjs/common";
import { SeancesService } from "./seances.service";
import { CreateSeanceDto } from "./dtos/createSeance.dto";
import { UpdateSeanceDto } from "./dtos/updateSeance.dto";

@Controller('api/seances')
export class SeancesController {
    constructor(private readonly seancesService: SeancesService){}

    @Post()
    create(@Body() createSeanceDto: CreateSeanceDto) {
        return this.seancesService.create(createSeanceDto);
    }

    @Get()
    findAll() {
        return this.seancesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.seancesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSeanceDto: UpdateSeanceDto) {
        return this.seancesService.update(id, updateSeanceDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.seancesService.remove(id);
    }
}