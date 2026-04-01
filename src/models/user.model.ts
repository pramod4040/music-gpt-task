import { SubscriptionStatus } from "generated/prisma/enums";
export interface GetUserForLogin {
    id: string;
    email: string;
    password: string;
    display_name: string;
    subscription_status: SubscriptionStatus;
}

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

export interface UserWithRefreshToken {
    id: string;
    email: string;
    display_name: string;
    subscription_status: SubscriptionStatus;
    refresh_token: string | null;
    force_login: boolean;
}