import { Controller, Post, Body, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Request } from "express";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import {
    CreateUserDto,
    LoginUserDto,
    RefreshTokenDto,
    RegisterResponseDto,
    LoginResponseDto,
    LogoutResponseDto,
    RefreshResponseDto,
    ErrorResponseDto,
} from "./dto/auth.dto";
import { CreateUserInterface } from "../models/user.model";
import { SubscriptionStatus } from "generated/prisma/enums";


@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: "User registered successfully", type: RegisterResponseDto })
    @ApiResponse({ status: 400, description: "Registration failed", type: ErrorResponseDto })
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            const userPayload: CreateUserInterface = {
                email: createUserDto.email,
                password: createUserDto.password,
                display_name: createUserDto.display_name,
                subscription_status: SubscriptionStatus.FREE
            };
            const user = await this.userService.createUser(userPayload);
            return {
                status: "success",
                data: user
            };
        } catch (error) {
            return {
                status: "error",
                message: error.message
            };
        }
    }

    @Post("login")
    @ApiOperation({ summary: "Login with email and password" })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({ status: 200, description: "Login successful", type: LoginResponseDto })
    @ApiResponse({ status: 500, description: "Invalid credentials", type: ErrorResponseDto })
    async login(@Body() loginUserDto: LoginUserDto) {
        try {
            console.log(process.env.NODE_ENV);
            const user = await this.authService.isValidUser(loginUserDto.email, loginUserDto.password);
            if (!user) {
                return {
                    status: "error",
                    message: "Invalid email or password"
                };
            }

            const payload = {
                id: user.id!,
                email: user.email,
                display_name: user.display_name,
                subscription_status: user.subscription_status
            };

            const accessToken = await this.authService.generateJwtToken(payload);
            const refreshToken = await this.authService.generateRefreshToken(payload);

            await this.authService.saveHashedRefreshToken(user.id!, refreshToken);

            return {
                status: "success",
                data: {
                    accessToken,
                    refreshToken,
                    user: payload
                }
            };
        } catch (error) {
            return {
                status: "error",
                message: error.message
            };
        }
    }

    @Post("logout")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Logout current user" })
    @ApiResponse({ status: 200, description: "Logged out successfully", type: LogoutResponseDto })
    @ApiResponse({ status: 401, description: "Unauthorized", type: ErrorResponseDto })
    async logout(@Req() req: Request) {
        try {
            await this.authService.logout(req.user!.id);
            return {
                status: "success",
                message: "Logged out successfully"
            };
        } catch (error) {
            return {
                status: "error",
                message: error.message
            };
        }
    }

    @Post("refresh")
    @ApiOperation({ summary: "Refresh access token using refresh token" })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({ status: 200, description: "Tokens refreshed successfully", type: RefreshResponseDto })
    @ApiResponse({ status: 401, description: "Invalid or expired refresh token", type: ErrorResponseDto })
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        try {
            const tokens = await this.authService.validateAndRotateRefreshToken(
                refreshTokenDto.refreshToken
            );
            return {
                status: "success",
                data: tokens
            };
        } catch (error) {
            return {
                status: "error",
                message: error.message
            };
        }
    }
}
