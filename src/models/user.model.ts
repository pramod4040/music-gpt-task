import { SubscriptionStatus } from "generated/prisma/enums";

export interface User {
    id?: string;
    email: string;
    password?: string;
    display_name: string;
    subscription_status: SubscriptionStatus;
}

export interface CreateUserInterface {
    email: string;
    password: string;
    display_name: string;
    subscription_status: SubscriptionStatus;
}


export interface JwtUserPayload {
    id: string;
    email: string;
    display_name: string;
    subscription_status: SubscriptionStatus;
}