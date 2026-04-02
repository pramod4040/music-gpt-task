import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "user@example.com" })
    email: string;

    @ApiProperty({ example: "password123" })
    password: string;

    @ApiProperty({ example: "John Doe" })
    display_name: string;
}

export class LoginUserDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "password123" })
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}

// ── Response shapes ──────────────────────────────────────────────

class UserResponseDto {
    @ApiProperty({ example: "uuid-v4" })
    id: string;

    @ApiProperty({ example: "user@example.com" })
    email: string;

    @ApiProperty({ example: "John Doe" })
    display_name: string;

    @ApiProperty({ example: "FREE", enum: ["FREE", "PAID"] })
    subscription_status: string;
}

export class RegisterResponseDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ type: UserResponseDto })
    data: UserResponseDto;
}

class LoginDataDto {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    refreshToken: string;

    @ApiProperty({ type: UserResponseDto })
    user: UserResponseDto;
}

export class LoginResponseDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ type: LoginDataDto })
    data: LoginDataDto;
}

export class LogoutResponseDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "Logged out successfully" })
    message: string;
}

class RefreshDataDto {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    refreshToken: string;
}

export class RefreshResponseDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ type: RefreshDataDto })
    data: RefreshDataDto;
}

export class ErrorResponseDto {
    @ApiProperty({ example: "error" })
    status: string;

    @ApiProperty({ example: "Something went wrong" })
    message: string;
}
