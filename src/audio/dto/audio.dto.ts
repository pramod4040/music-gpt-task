import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateAudioTitleDto {
  @ApiProperty({ example: "My Favorite Track", description: "New title for the audio" })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;
}

export class AudioDto {
  @ApiProperty({ example: "uuid-v4" })
  id?: string;

  @ApiProperty({ example: "uuid-v4" })
  prompt_id: string;

  @ApiProperty({ example: "uuid-v4" })
  user_id: string;

  @ApiProperty({ example: "My Favorite Track" })
  title: string;

  @ApiProperty({ example: "https://cdn.example.com/audio/track.mp3" })
  url: string;

  @ApiProperty({ example: "2026-04-02T00:00:00.000Z" })
  created_at: Date;

  @ApiProperty({ example: "2026-04-02T00:00:00.000Z" })
  updated_at: Date;
}

export class AudioListResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ type: [AudioDto] })
  data: AudioDto[];
}

export class AudioResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ type: AudioDto })
  data: AudioDto;
}

export class AudioNotFoundResponseDto {
  @ApiProperty({ example: "error" })
  status: string;

  @ApiProperty({ example: "Audio not found" })
  message: string;
}
