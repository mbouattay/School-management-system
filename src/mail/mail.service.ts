import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, RequestTimeoutException } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService : MailerService){}

    public async sendVerifyEmailTemplate (username:string,link:string,password:string ){
        try{
            await this.mailerService.sendMail({
                to: username,
                from: `<no-reply@MySchool>`,
                subject: 'Verify your account',
                template: 'verify-email',
                context: {link,username,password}
            })
        }catch(error){
            console.log(error) ; 
            throw new RequestTimeoutException() ; 
        }
    } 

}