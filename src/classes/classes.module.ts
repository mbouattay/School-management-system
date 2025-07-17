import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Classe } from "./classe.entity";
import { ClassesController } from "./classes.controller";
import { ClassesService } from "./classes.service";

@Module({
        imports : [TypeOrmModule.forFeature([Classe])],
        controllers: [ClassesController],
        providers: [ClassesService],
        exports:[ClassesService]
})
export class ClassesModule {}