import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { saveData, destroyData, destroyAllData } from '../utils/storage';
import type { LoginPayload } from '../types/auth.types';

const AUTH_KEY = 'auth-user';
const TOKEN_KEY = 'token-user';

export const useAuth = () => {
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: (response) => {
            saveData(AUTH_KEY, response.user);
            saveData(TOKEN_KEY, response.token);
            navigate('/inicio', { replace: true });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            destroyData(AUTH_KEY);
            destroyData(TOKEN_KEY);
            destroyAllData();
            navigate('/login', { replace: true });
        },
    });

    return {
        login: loginMutation.mutate,
        isLoading: loginMutation.isPending,
        isError: loginMutation.isError,
        error: loginMutation.error,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
    };
};