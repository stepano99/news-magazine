import {
    Length,
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 15)
    password: string;
}


