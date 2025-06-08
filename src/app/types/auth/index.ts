import { Session } from "next-auth";

export interface UserSession extends Session {
    user: UserInfoSession;
    expires: string;
    accessToken?: string;
}

export interface UserInfoSession {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
};