import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateDisplayNameDto {
  @ApiProperty({ example: "Jane Doe", description: "New display name for the user" })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  display_name: string;
}

export class UserDto {
  @ApiProperty({ example: "clxyz123", description: "User ID" })
  id: string;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "Jane Doe" })
  display_name: string;

  @ApiProperty({ example: "FREE", enum: ["FREE", "PAID"] })
  subscription_status: string;
}

export class UsersListResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}

export class GetUserResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ type: UserDto })
  data: UserDto;
}

export class UserNotFoundResponseDto {
  @ApiProperty({ example: "error" })
  status: string;

  @ApiProperty({ example: "User not found" })
  message: string;
}
