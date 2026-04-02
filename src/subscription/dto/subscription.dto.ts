import { ApiProperty } from "@nestjs/swagger";

export class SubscriptionResponseDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "Subscription activated" })
    message: string;
}

export class CancelResponseDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "Subscription cancelled" })
    message: string;
}

export class SubscriptionErrorResponseDto {
    @ApiProperty({ example: "error" })
    status: string;

    @ApiProperty({ example: "Something went wrong" })
    message: string;
}
