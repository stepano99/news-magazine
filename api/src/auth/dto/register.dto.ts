import {
    Length,
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
import { Role } from '../types/roles.enum';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 15)
    password: string;

    // @IsString()
    // @IsNotEmpty()
    roles: Role[];

}


