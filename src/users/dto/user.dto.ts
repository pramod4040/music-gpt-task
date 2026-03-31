import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserResponseDto {
    id: string;
    email: string;
    display_name: string;
    subscription_status: string;
}

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

