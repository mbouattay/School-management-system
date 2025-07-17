import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matiere } from './matiere.entity';
import { MatieresController } from './matieres.controller';
import { MatieresService } from './matieres.service';

@Module({
  imports: [TypeOrmModule.forFeature([Matiere])],
  controllers: [MatieresController],
  providers: [MatieresService],
})
export  class MatieresModule {}