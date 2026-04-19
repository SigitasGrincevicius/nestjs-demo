import { IsEmail, IsNotEmpty, IsString, isString } from "class-validator";

export class LoginDto {
   @IsEmail()
   email!: string;

   @IsString()
   @IsNotEmpty()
   password!: string;
}