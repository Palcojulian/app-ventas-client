export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}