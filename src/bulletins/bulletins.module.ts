import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Bulletin } from "./bulletin.entity";

@Module({
    imports : [TypeOrmModule.forFeature([Bulletin])]
})
export class BulletinsModule {}