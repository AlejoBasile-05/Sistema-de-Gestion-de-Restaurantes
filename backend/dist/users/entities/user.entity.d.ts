export declare enum UserRole {
    MOZO = "mozo",
    COCINERO = "cocinero",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    dni: number;
    name: string;
    role: UserRole;
    password: string;
}
