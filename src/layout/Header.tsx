import { CircleUser, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getData } from '../utils/storage';
import type { User } from '../types/auth.types';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const { logout, isLoggingOut } = useAuth();
    const user = getData<User>('auth-user');

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="flex items-center justify-between px-3 sm:px-5 py-3 md:py-4 border-b border-gray-200 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg hover:cursor-pointer"
                    title="Menú"
                    aria-label="Abrir menú"
                >
                    <Menu width={24} height={24} />
                </button>
                <h2 className="text-lg md:text-2xl">Dashboard</h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="hidden sm:flex flex-col items-end">
                    <h6 className="text-sm md:text-base">{user?.name ?? 'Usuario'}</h6>
                    <span className="text-xs md:text-sm text-gray-600">{user?.email ?? ''}</span>
                </div>
                <CircleUser className="text-gray-600 w-8 h-8 md:w-12 md:h-12" />
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:cursor-pointer disabled:opacity-50"
                    title="Cerrar sesión"
                >
                    <LogOut width={22} height={22} className="sm:w-6 sm:h-6 md:w-10 md:h-10" />
                </button>
            </div>
        </header>
    );
};

export default Header;
