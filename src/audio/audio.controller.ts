import { Controller, Get, Put, Param, Body, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Request } from "express";
import { AudioService } from "./audio.service";
import {
  UpdateAudioTitleDto,
  AudioListResponseDto,
  AudioResponseDto,
  AudioNotFoundResponseDto,
} from "./dto/audio.dto";

@ApiTags("Audio")
@ApiBearerAuth()
@Controller("audio")
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  @ApiOperation({ summary: "Get all audios for the current user" })
  @ApiResponse({ status: 200, description: "List of audios", type: AudioListResponseDto })
  async findAll(@Req() req: Request) {
    const audios = await this.audioService.findAllByUser(req.user!.id);
    return { status: "success", data: audios };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single audio by ID" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiResponse({ status: 200, description: "Audio found", type: AudioResponseDto })
  @ApiResponse({ status: 404, description: "Audio not found", type: AudioNotFoundResponseDto })
  async findOne(@Param("id") id: string, @Req() req: Request) {
    try {
      const audio = await this.audioService.findByIdAndUser(id, req.user!.id);
      return { status: "success", data: audio };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Update audio title" })
  @ApiParam({ name: "id", description: "Audio ID" })
  @ApiBody({ type: UpdateAudioTitleDto })
  @ApiResponse({ status: 200, description: "Audio updated", type: AudioResponseDto })
  @ApiResponse({ status: 404, description: "Audio not found", type: AudioNotFoundResponseDto })
  async updateTitle(
    @Param("id") id: string,
    @Body() body: UpdateAudioTitleDto,
    @Req() req: Request,
  ) {
    try {
      const audio = await this.audioService.updateTitle(id, req.user!.id, body.title);
      return { status: "success", data: audio };
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }
}
