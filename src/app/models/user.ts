export interface User {
    id: number;
    username: string;
    passwordHash: string;
    email: string;
    createdAt: string;
    role:string;
    verified:boolean;
    wishlist:string;
}
