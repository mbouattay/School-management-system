import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { EmploisDeTempsService } from "./emploisDeTemps.service";

@Controller('api/emplois-de-temps')
export class EmploisDeTempsController {
    constructor(private readonly emploisDeTempsService : EmploisDeTempsService){}

    @Get('classe/:classeId')
    async getAndCreateEmploi(@Param('classeId', ParseIntPipe) classeId: number) {
        return this.emploisDeTempsService.getAndCreateEmploi(classeId);
    }
}