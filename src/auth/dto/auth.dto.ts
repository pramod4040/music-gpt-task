import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    email: string;
    password: string;
    display_name: string;
}

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
