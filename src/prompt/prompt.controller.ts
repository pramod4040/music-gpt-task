import { Controller, Post, Body, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Request } from "express";
import { PromptService } from "./prompt.service";
import { CreatePromptDto, PromptResponseDto } from "./dto/prompt.dto";

@ApiTags("Prompt")
@ApiBearerAuth()
@Controller("prompt")
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  @ApiOperation({ summary: "Create a new prompt" })
  @ApiBody({ type: CreatePromptDto })
  @ApiResponse({ status: 201, description: "Prompt created", type: PromptResponseDto })
  async create(@Body() body: CreatePromptDto, @Req() req: Request) {
    const prompt = await this.promptService.create(req.user!.id, body.text);
    return { status: "success", data: prompt };
  }
}
