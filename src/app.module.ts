import { Module } from '@nestjs/common';
import { Enseignant } from './users/enseignant.entity';
import { Etudiant } from './users/etudiant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { Classe } from './classes/classe.entity';
import { Matiere } from './matieres/matiere.entity';
import { MatieresModule } from './matieres/matieres.module';
import { EmploisDeTempsModule } from './emploisDeTemps/emploisDeTemps.module';
import { SeancesModule } from './seances/seances.module';
import { Seance } from './seances/seance.entity';
import { EmploiDeTemps } from './emploisDeTemps/emploiDeTemps.entity';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/note.entity';
import { BulletinsModule } from './bulletins/bulletins.module';
import { Bulletin } from './bulletins/bulletin.entity';
import { Admin } from './users/admin.entity';

@Module({
  imports: [
    UsersModule,
    ClassesModule,
    MatieresModule,
    EmploisDeTempsModule,
    SeancesModule,
    NotesModule,
    BulletinsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: config.get<number>("DB_PORT"),
          username: config.get<string>("DB_USERNAME"),
          password: config.get<string>("DB_PASSWORD"),
          database: config.get<string>("DB_DATABASE"),
          entities: [User,Enseignant,Etudiant,Classe,Matiere,Seance,EmploiDeTemps,Note,Bulletin,Admin],
          synchronize: true,
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development'
    })
  ],
})
export class AppModule {}
