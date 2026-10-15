import { ChartColumnStacked, ChartPie, Package, Users, ShoppingCart, DollarSign, X, Boxes } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const baseClass =
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:cursor-pointer';
    const activeClass =
        'bg-indigo-500 text-white shadow-sm shadow-indigo-500/20';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

    const links = [
        { to: '/inicio', icon: ChartPie, label: 'Dashboard' },
        { to: '/categorias', icon: ChartColumnStacked, label: 'Categorías' },
        { to: '/proveedores', icon: Users, label: 'Proveedores' },
        { to: '/productos', icon: Package, label: 'Productos' },
        { to: '/compras', icon: ShoppingCart, label: 'Compras' },
        { to: '/ventas', icon: DollarSign, label: 'Ventas' },
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-72 sm:w-72 bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    md:sticky md:top-16 md:translate-x-0 md:z-10 md:h-full
                    md:w-64 md:flex-shrink-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
                aria-label="Navegación principal"
            >
                <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Boxes className="text-indigo-600" width={22} height={22} />
                        <h3 className="text-base font-bold text-gray-900">Menú</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg hover:cursor-pointer"
                        title="Cerrar menú"
                        aria-label="Cerrar menú"
                    >
                        <X width={20} height={20} />
                    </button>
                </div>

                <nav className="p-3 sm:p-4 overflow-y-auto h-full">
                    <ul className="space-y-1">
                        {links.map(({ to, icon: Icon, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `${baseClass} ${isActive ? activeClass : inactiveClass}`
                                    }
                                    end
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                width={18}
                                                height={18}
                                                className={
                                                    isActive
                                                        ? 'text-white'
                                                        : 'text-gray-500 group-hover:text-gray-700'
                                                }
                                            />
                                            <span className="truncate">{label}</span>
                                            {isActive && (
                                                <span
                                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="px-3 py-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-700">Tip</p>
                            <p className="mt-1 text-xs text-indigo-900/70 leading-relaxed">
                                Usa atajos del menú lateral para navegar más rápido entre módulos.
                            </p>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
