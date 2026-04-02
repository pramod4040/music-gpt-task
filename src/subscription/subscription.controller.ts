import { Controller, Post, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Request } from "express";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionResponseDto, CancelResponseDto, SubscriptionErrorResponseDto } from "./dto/subscription.dto";

@ApiTags("Subscription")
@ApiBearerAuth()
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @ApiOperation({ summary: "Activate subscription for current user" })
  @ApiResponse({ status: 200, description: "Subscription activated", type: SubscriptionResponseDto })
  @ApiResponse({ status: 500, description: "Unauthorized", type: SubscriptionErrorResponseDto })
  async subscribe(@Req() req: Request) {
    try {
      await this.subscriptionService.subscribe(req.user!.id);
      return {
        status: "success",
        message: "Subscription activated"
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }

  @Post('cancel')
  @ApiOperation({ summary: "Cancel subscription for current user" })
  @ApiResponse({ status: 200, description: "Subscription cancelled", type: CancelResponseDto })
  @ApiResponse({ status: 500, description: "Unauthorized", type: SubscriptionErrorResponseDto })
  async cancel(@Req() req: Request) {
    try {
      await this.subscriptionService.cancel(req.user!.id);
      return {
        status: "success",
        message: "Subscription cancelled"
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
}
