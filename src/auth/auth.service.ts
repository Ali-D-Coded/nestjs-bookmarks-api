/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "src/dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){
        
    }
   async signup(values: AuthDto) {
        const hash = await argon.hash(values.password)

        try{
 const user = await this.prisma.user.create({
            data: {
                email: values.email,
                hash
            }
        })
       return user;
        } catch(error){
if(error instanceof PrismaClientKnownRequestError){
    throw new ForbiddenException('Credentials taken');
            }
            throw error
        }
       
    }
    
   async signin(values: AuthDto) {
//find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: values.email,
            }
        });
        //if user does not exist throw exception
        if(!user){
            throw new ForbiddenException('Credntials incorrect');
        }

        //compare password
        const pwMatch = await argon.verify(user.hash,values.password)
        //if password incorrect throw exception
        if(!pwMatch){
             throw new ForbiddenException("Credntials doesn't match");
        }

        //send back the user 
         return user
    }
}

