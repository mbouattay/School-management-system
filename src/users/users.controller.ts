import { Body, Controller, Post, Patch, Delete, Param, Get, ParseIntPipe, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto } from "./dtos/register.dto";
import { LoginDto } from "./dtos/login.dto";
import { UpdateEtudiantDto } from "./dtos/updateEtudiant.dto";
import { UpdateEnseignantDto } from "./dtos/updateEnseignant.dto";
import { Roles } from "./decorators/user-role.decorator";
import { UserType } from "src/utils/enums";
import { AuthRolesGuard } from "./guards/auth-roles.guard";
@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post("/register")
    @HttpCode(HttpStatus.OK)
    public register(@Body() body: RegisterDto) {
        return this.usersService.register(body);
    }

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    public login(@Body() body: LoginDto) {
        return this.usersService.login(body);
    }
    @Get("verify-email/:id/:verificationToken")
    public verifyEmail(
        @Param('id', ParseIntPipe) id: number,
        @Param('verificationToken') verificationToken: string
    ) {
        return this.usersService.verifyEmail(id, verificationToken);
    }

    @Patch("/etudiants/:id")
    public updateEtudiant(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateEtudiantDto
    ) {
        return this.usersService.updateEtudiant(id, body);
    }

    @Delete("/etudiants/:id")
    public deleteEtudiant(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.deleteEtudiant(id);
    }
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRolesGuard)
    @Get("/etudiants")
    public getAllEtudiants() {
        return this.usersService.getAllEtudiants();
    }

    @Get("/etudiants/search")
    public searchEtudiant(@Query('q') q: string) {
        return this.usersService.searchEtudiant(q);
    }

    @Get("/enseignants/search")
    public searchEnseignant(@Query('q') q: string) {
        return this.usersService.searchEnseignant(q);
    }

    @Patch("/enseignants/:id")
    public updateEnseignant(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateEnseignantDto
    ) {
        return this.usersService.updateEnseignant(id, body);
    }

    @Delete("/enseignants/:id")
    public deleteEnseignant(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.deleteEnseignant(id);
    }

    @Get("/enseignants")
    public getAllEnseignants() {
        return this.usersService.getAllEnseignants();
    }
}