import { Controller, Get, Put, Param, Body, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import {
  UpdateDisplayNameDto,
  UserResponseDto,
  UsersListResponseDto,
  UserNotFoundResponseDto,
} from "./dto/user.dto";
import { paginate } from "../common/helpers";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "List of users", type: UsersListResponseDto })
  async findAll(
    @Query('page') page: string = "1",
    @Query('limit') limit: string = "20"
  ) {
    const { skipInt,  limitInt } = paginate(page, limit);
    const users = await this.usersService.findAllPaginated(skipInt, limitInt);
    return { status: "success", data: users };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User found", type: UserResponseDto })
  @ApiResponse({ status: 404, description: "User not found", type: UserNotFoundResponseDto })
  async findOne(@Param("id") id: string) {
    try {
      const user = await this.usersService.findById(id);
      return { status: "success", data: user };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user display name" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiBody({ type: UpdateDisplayNameDto })
  @ApiResponse({ status: 200, description: "User updated", type: UserResponseDto })
  @ApiResponse({ status: 404, description: "User not found", type: UserNotFoundResponseDto })
  async updateDisplayName(
    @Param("id") id: string,
    @Body() body: UpdateDisplayNameDto,
  ) {
    try {
      const user = await this.usersService.updateDisplayName(id, body.display_name);
      return { status: "success", data: user };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }
}
