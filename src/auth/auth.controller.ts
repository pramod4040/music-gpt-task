import { Controller, Post, Body, Req } from "@nestjs/common";
import { Request } from "express";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from "./dto/auth.dto";
import { CreateUserInterface } from "../models/user.model";
import { SubscriptionStatus } from "generated/prisma/enums";


@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Post("register")
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
    async login(@Body() loginUserDto: LoginUserDto) {
        try {
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
