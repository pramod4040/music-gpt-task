import { Controller, Post, Body } from "@nestjs/common";
import { UserService } from "./service/users.service";
import { CreateUserDto, LoginUserDto } from "./dto/user.dto";
import { CreateUserInterface } from "../models/user.model";
import { SubscriptionStatus } from "generated/prisma/enums";
import { AuthService } from "./service/auth.service";


@Controller('auth')
export class UsersController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Post("register")
    async register(
        @Body() createUserDto: CreateUserDto
    ) {
        try {
            let userPaylod: CreateUserInterface = {
                email: createUserDto.email,
                password: createUserDto.password,
                display_name: createUserDto.display_name,
                subscription_status: SubscriptionStatus.FREE
            }
            const user = await this.userService.createUser(userPaylod);
            return {
                status: "success",
                data: user
            }
        } catch (error) {
            return {
                status: "error",
                message: error.message
            }
        }
    }

    @Post("login")
    async login(
        @Body() loginUserDto: LoginUserDto
    ) {
       try {
            const user = await this.authService.isValidUser(loginUserDto.email, loginUserDto.password);
            if (!user) {
                return {
                    status: "error",
                    message: "Invalid email or password"
                }
            }

            const payload = {
                id: user.id!,
                email: user.email,
                display_name: user.display_name,
                subscription_status: user.subscription_status
            }

            const token = await this.authService.generateJwtToken(payload);
            return {
                status: "success",
                data: {
                    accesstoken: token,
                    user: payload
                }
            }
       } catch (error) {
            return {
                status: "error",
                message: error.message
            }
        }
    }
}