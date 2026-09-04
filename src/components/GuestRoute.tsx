import { Navigate } from 'react-router-dom';
import { getData } from '../utils/storage';

interface GuestRouteProps {
    children: React.ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
    const token = getData<string>('token-user');

    if (token) {
        return <Navigate to="/inicio" replace />;
    }

    return children;
};