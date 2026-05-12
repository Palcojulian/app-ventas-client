import { CircleUser, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getData } from "../utils/storage";
import type { User } from "../types/auth.types";

const Header = () => {
    const { logout, isLoggingOut } = useAuth();
    const user = getData<User>('auth-user');

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="flex items-center justify-between px-5 py-4">
            <h2>
                Dashboard
            </h2>
            <div className="flex items-center gap-4" >
                <div className="flex flex-col items-end" >
                    <h6>{user?.name ?? 'Usuario'}</h6>
                    <span className="text-sm text-gray-600" >{user?.email ?? ''}</span>
                </div>
                <CircleUser className="text-gray-600" width={50} height={50} />
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="p-2 text-gray-600 hover:text-red-600 hover:cursor-pointer disabled:opacity-50"
                    title="Cerrar sesión"
                >
                    <LogOut width={40} height={40} />
                </button>
            </div>
        </header>
    )
}


export default Header;