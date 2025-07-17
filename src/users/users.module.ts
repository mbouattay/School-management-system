import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Etudiant } from "./etudiant.entity";
import { Enseignant } from "./enseignant.entity";
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { MailModule } from "src/mail/mail.module";
import { ClassesModule } from "src/classes/classes.module";
import { Classe } from '../classes/classe.entity';
@Module({
  imports: [
    MailModule,
   
    TypeOrmModule.forFeature([User, Etudiant, Enseignant, Classe]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}