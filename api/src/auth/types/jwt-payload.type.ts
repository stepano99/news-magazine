import { Role } from "./roles.enum";

export type JwtPayload = {
    email: string;
    sub: string;
    roles: Role[]
}