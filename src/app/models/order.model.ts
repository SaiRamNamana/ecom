import { Item } from "./item.model";

export interface Order{
    orderdate:Date;
    total:number;
    items:Item[];
}