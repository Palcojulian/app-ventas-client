import { ChartColumnStacked, ChartPie, Package, Users, ShoppingCart, DollarSign, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const baseClass =
        'flex items-center gap-3 rounded-xl p-3 font-light hover:cursor-pointer transition-colors';
    const activeClass = 'bg-indigo-500 text-white hover:bg-indigo-400';
    const inactiveClass = 'text-gray-700 hover:bg-gray-100';

    const links = [
        { to: '/inicio', icon: ChartPie, label: 'Dashboard' },
        { to: '/categorias', icon: ChartColumnStacked, label: 'Categorías' },
        { to: '/proveedores', icon: Users, label: 'Proveedores' },
        { to: '/productos', icon: Package, label: 'Productos' },
        { to: '/compras', icon: ShoppingCart, label: 'Compras' },
        { to: '/ventas', icon: DollarSign, label: 'Ventas' },
    ];

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:w-auto md:min-w-[250px] md:z-auto md:bg-transparent md:border-r-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200">
                <h3 className="text-lg font-bold text-indigo-600">Menú</h3>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg hover:cursor-pointer"
                    title="Cerrar menú"
                >
                    <X width={20} height={20} />
                </button>
            </div>

            <div className="p-3 sm:p-5">
                <ul className="space-y-2 sm:space-y-3">
                    {links.map(({ to, icon: Icon, label }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${baseClass} ${isActive ? activeClass : inactiveClass}`
                                }
                            >
                                <Icon />
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
