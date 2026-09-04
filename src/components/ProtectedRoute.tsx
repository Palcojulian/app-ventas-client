import { Navigate } from 'react-router-dom';
import { getData } from '../utils/storage';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = getData<string>('token-user');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};