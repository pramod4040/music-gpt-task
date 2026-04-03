import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePromptDto {
  @ApiProperty({ example: "A calm jazz melody with piano", description: "The prompt text" })
  @IsNotEmpty()
  @IsString()
  text: string;
}

export class PromptDto {
  @ApiProperty({ example: "uuid-v4" })
  id: string;

  @ApiProperty({ example: "uuid-v4" })
  user_id: string;

  @ApiProperty({ example: "A calm jazz melody with piano" })
  text: string;

  @ApiProperty({ example: "PENDING" })
  status: string;

  @ApiProperty({ example: "2026-04-03T00:00:00.000Z" })
  created_at: Date;

  @ApiProperty({ example: "2026-04-03T00:00:00.000Z" })
  updated_at: Date;
}

export class PromptResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ type: PromptDto })
  data: PromptDto;
}
