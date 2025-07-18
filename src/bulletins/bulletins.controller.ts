import { Controller, Get, Query } from "@nestjs/common";
import { BulletinService } from "./bulletins.service";

@Controller('bulletins')
export class BulletinController{
    constructor ( private readonly bulletinService: BulletinService){}

    @Get('by-etudiant')
    getBulletinForEtudiant(@Query('etudiantId') etudiantId: number, @Query('trimester') trimester: string) {
        return this.bulletinService.getBulletinForEtudiant(Number(etudiantId), trimester);
    }

    @Get('by-classe')
    getAllBulletinsByClasseAndTrimester(@Query('classeId') classeId: number, @Query('trimester') trimester: string) {
        return this.bulletinService.getAllBulletinsByClasseAndTrimester(Number(classeId), trimester);
    }

    @Get('stats-moyenne')
    getStatsMoyenneGeneraleByClasseAndTrimester(@Query('classeId') classeId: number, @Query('trimester') trimester: string) {
        return this.bulletinService.getStatsMoyenneGeneraleByClasseAndTrimester(Number(classeId), trimester);
    }
}