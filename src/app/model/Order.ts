import { Menu } from "./Menu";

export class Order {
    id: string;
	guid: number;
	rating: number;
	tableName : string;
    status: string;
    menuItems: Menu[];
	total: number;
	chef: string;
	steward: string;
	isConsumable: boolean;
}