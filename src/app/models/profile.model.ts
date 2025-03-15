import { Address } from "./address.model";

export interface Profile{
    userId?:number;
    profileImage?:string;
    addresses?:Address[];
}