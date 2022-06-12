/* eslint-disable prettier/prettier */
import { Controller, Post, Body, ParseIntPipe } from "@nestjs/common";
import { Request } from "express";
import { AuthDto } from "src/dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        
        return this.authService.signup(dto)
    }

    @Post('signin')
    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto)
    }
}