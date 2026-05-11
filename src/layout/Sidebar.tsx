import { ChartColumnStacked, ChartPie, Package, Users, ShoppingCart, DollarSign } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const baseClass = "flex items-center gap-3 rounded-xl p-3 font-light hover:cursor-pointer transition-colors";
    const activeClass = "bg-indigo-500 text-white hover:bg-indigo-400";
    const inactiveClass = "text-gray-700 hover:bg-gray-100";

    return (
        <div className="min-w-[250px] p-5">
            <ul className="space-y-3">
                <li>
                    <NavLink
                        to="/inicio"
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <ChartPie />
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/categorias"
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <ChartColumnStacked  />
                        Categorías
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/proveedores"
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <Users  />
                        Proveedores
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/productos"
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <Package  />
                        Productos
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/compras"
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <ShoppingCart  />
                        Compras
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/ventas"
                        className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <DollarSign  />
                        Ventas
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;