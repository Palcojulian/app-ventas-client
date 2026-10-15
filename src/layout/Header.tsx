import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    CircleUser,
    LogOut,
    Menu,
    User as UserIcon,
    ChevronDown,
    Boxes,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getData } from '../utils/storage';
import type { User } from '../types/auth.types';

interface HeaderProps {
    onToggleSidebar: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
    '/inicio': 'Dashboard',
    '/categorias': 'Categorías',
    '/proveedores': 'Proveedores',
    '/productos': 'Productos',
    '/compras': 'Compras',
    '/ventas': 'Ventas',
};

const getTitleForPath = (path: string) => {
    return ROUTE_TITLES[path] ?? 'Dashboard';
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
    const { logout, isLoggingOut } = useAuth();
    const user = getData<User>('auth-user');
    const location = useLocation();
    const title = getTitleForPath(location.pathname);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        if (menuOpen) {
            document.addEventListener('mousedown', handleClick);
            document.addEventListener('keydown', handleKey);
        }
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [menuOpen]);

    return (
        <header className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3 border-b border-gray-200 bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg hover:cursor-pointer flex-shrink-0"
                    title="Menú"
                    aria-label="Abrir menú"
                >
                    <Menu width={22} height={22} />
                </button>
                <div className="flex items-center gap-2 md:hidden">
                    <Boxes className="text-indigo-600" width={22} height={22} />
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
                    {title}
                </h2>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                <div className="hidden sm:flex flex-col items-end leading-tight min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-[160px]">
                        {user?.name ?? 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-[160px]">
                        {user?.email ?? ''}
                    </p>
                </div>

                <div className="relative">
                    <button
                        ref={buttonRef}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex items-center gap-1.5 p-1 sm:p-1.5 hover:bg-gray-100 rounded-lg hover:cursor-pointer transition-colors"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-label="Menú de usuario"
                    >
                        <CircleUser className="text-gray-600 w-8 h-8" />
                        <ChevronDown
                            width={14}
                            height={14}
                            className={`text-gray-500 hidden sm:block transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {menuOpen && (
                        <div
                            ref={menuRef}
                            role="menu"
                            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-30"
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user?.name ?? 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email ?? ''}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:cursor-pointer transition-colors"
                                role="menuitem"
                            >
                                <UserIcon width={16} height={16} />
                                Ver perfil
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    logout();
                                }}
                                disabled={isLoggingOut}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-t border-gray-100"
                                role="menuitem"
                            >
                                <LogOut width={16} height={16} />
                                {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
