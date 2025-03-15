export interface Product{
    id: number;
    title:string;
    image:string;
    price:number;
    rating:{
        rate:number;
        count:number;
    };
    stock:number;
    count:number;
    description?:string;
    categoryId?: number;
}