import { Role } from "../model/Role";

export class JwtResponse {
    jwttoken: string;
    message: string;
    userName: string;
    roles: Role[];
}
