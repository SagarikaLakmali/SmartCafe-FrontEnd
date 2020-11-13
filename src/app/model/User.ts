import { Role } from "./Role";
import { Department } from "./Department";
import { Address } from "./Address";

export class User {
    guid: number;
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    image: any;
    active: boolean;
    role: Role;
    address: Address;
    department: Department;
    createdBy: string;
    updatedBy: string;
}