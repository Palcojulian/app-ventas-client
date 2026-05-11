import { Api } from '../config/axios';
import type { LoginPayload, LoginResponse } from '../types/auth.types';

interface LogoutResponse {
    success: boolean;
    message: string;
}

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const { data } = await Api.post<LoginResponse>('/api/auth/login', payload);
        return data;
    },
    logout: async (): Promise<LogoutResponse> => {
        const { data } = await Api.post<LogoutResponse>('/api/auth/logout');
        return data;
    },
};