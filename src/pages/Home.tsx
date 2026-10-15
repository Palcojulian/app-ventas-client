import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
    Package,
    Boxes,
    ShoppingCart,
    AlertTriangle,
    ArrowRight,
    TrendingUp,
    DollarSign,
    Plus,
    List,
} from 'lucide-react';
import { useProductos } from '../hooks/useProducto';
import type { Producto } from '../types/producto.types';
import { useCategorias } from '../hooks/useCategoria';
import type { Categoria } from '../types/categoria.types';
import { useVentas } from '../hooks/useVenta';
import type { Venta } from '../types/venta.types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { estadoToVariant } from '../components/ui/badge-helpers';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';

interface KpiProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    accentClass: string;
    loading?: boolean;
}

const KpiCard = ({ title, value, subtitle, icon: Icon, accentClass, loading }: KpiProps) => {
    return (
        <Card className="relative overflow-hidden">
            <div
                className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20 blur-xl ${accentClass}`}
            />
            <div className="relative flex items-start gap-4">
                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentClass}`}
                >
                    <Icon className="text-white" width={22} height={22} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {title}
                    </p>
                    {loading ? (
                        <Skeleton className="mt-1 h-7 w-20" />
                    ) : (
                        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                    )}
                    {subtitle && !loading && (
                        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
                    )}
                </div>
            </div>
        </Card>
    );
};

const fmt = (n: number) =>
    `$${n.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const Home = () => {
    const { data: productos, isLoading: loadingProductos } = useProductos();
    const { data: categorias, isLoading: loadingCategorias } = useCategorias();
    const { data: ventas, isLoading: loadingVentas } = useVentas();

    const today = new Date();
    const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    ).getTime();

    const ventasHoy = useMemo<Venta[]>(() => {
        if (!ventas) return [];
        return ventas.filter((v) => new Date(v.created_at).getTime() >= startOfDay);
    }, [ventas, startOfDay]);

    const totalVentasHoy = useMemo(
        () =>
            ventasHoy.reduce(
                (acc, v) => (v.estado !== 'cancelado' ? acc + Number(v.total) : acc),
                0,
            ),
        [ventasHoy],
    );

    const productosStockBajo = useMemo<Producto[]>(() => {
        if (!productos) return [];
        return productos.filter((p) => p.stock_actual <= p.stock_minimo);
    }, [productos]);

    const ultimasVentas = useMemo<Venta[]>(() => {
        if (!ventas) return [];
        return [...ventas]
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )
            .slice(0, 5);
    }, [ventas]);

    const categoriasActivas = useMemo(
        () =>
            (categorias ?? []).filter(
                (c: Categoria) => c.estado === 'activo',
            ).length,
        [categorias],
    );

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Bienvenido 👋
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Resumen general de tu tienda al día de hoy.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                    title="Productos"
                    value={productos?.length ?? 0}
                    subtitle={`${categoriasActivas} categorías activas`}
                    icon={Package}
                    accentClass="bg-indigo-500"
                    loading={loadingProductos}
                />
                <KpiCard
                    title="Categorías"
                    value={categorias?.length ?? 0}
                    subtitle={`${categoriasActivas} activas`}
                    icon={Boxes}
                    accentClass="bg-violet-500"
                    loading={loadingCategorias}
                />
                <KpiCard
                    title="Ventas hoy"
                    value={fmt(totalVentasHoy)}
                    subtitle={`${ventasHoy.length} ventas registradas`}
                    icon={DollarSign}
                    accentClass="bg-emerald-500"
                    loading={loadingVentas}
                />
                <KpiCard
                    title="Stock bajo"
                    value={productosStockBajo.length}
                    subtitle={
                        productosStockBajo.length > 0
                            ? 'Productos que requieren atención'
                            : 'Todo en orden'
                    }
                    icon={AlertTriangle}
                    accentClass="bg-amber-500"
                    loading={loadingProductos}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Card className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Últimas ventas
                            </h3>
                            <p className="text-sm text-gray-500">
                                Las 5 ventas más recientes.
                            </p>
                        </div>
                        <Link to="/ventas">
                            <Button
                                variant="ghost"
                                size="sm"
                                rightIcon={<ArrowRight size={14} />}
                            >
                                Ver todas
                            </Button>
                        </Link>
                    </div>

                    {loadingVentas ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-12" />
                            ))}
                        </div>
                    ) : ultimasVentas.length === 0 ? (
                        <p className="text-sm text-gray-500 py-8 text-center">
                            Aún no hay ventas registradas.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {ultimasVentas.map((v) => (
                                <li
                                    key={v.id}
                                    className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {v.numero_factura}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {v.cliente} · {v.usuario_sistema}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <Badge variant={estadoToVariant(v.estado)}>
                                            {v.estado}
                                        </Badge>
                                        <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                                            ${Number(v.total).toFixed(2)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <Card>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                        Accesos rápidos
                    </h3>
                    <div className="space-y-2">
                        <Link
                            to="/ventas"
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <DollarSign size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                    Registrar venta
                                </p>
                                <p className="text-xs text-gray-500">
                                    Crea una venta nueva
                                </p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400" />
                        </Link>

                        <Link
                            to="/compras"
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                                <ShoppingCart size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                    Registrar compra
                                </p>
                                <p className="text-xs text-gray-500">
                                    Agregar stock al inventario
                                </p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400" />
                        </Link>

                        <Link
                            to="/productos"
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Plus size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                    Nuevo producto
                                </p>
                                <p className="text-xs text-gray-500">
                                    Da de alta un producto
                                </p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400" />
                        </Link>

                        <Link
                            to="/categorias"
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <List size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">
                                    Ver categorías
                                </p>
                                <p className="text-xs text-gray-500">
                                    Organiza tus productos
                                </p>
                            </div>
                            <ArrowRight size={16} className="text-gray-400" />
                        </Link>
                    </div>
                </Card>
            </div>

            {productosStockBajo.length > 0 && (
                <Card>
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-amber-500" />
                                Productos con stock bajo
                            </h3>
                            <p className="text-sm text-gray-500">
                                Considera reponer pronto estos productos.
                            </p>
                        </div>
                        <Link to="/productos">
                            <Button
                                variant="ghost"
                                size="sm"
                                rightIcon={<ArrowRight size={14} />}
                            >
                                Ver productos
                            </Button>
                        </Link>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {productosStockBajo.slice(0, 5).map((p) => (
                            <li
                                key={p.id}
                                className="flex items-center gap-3 py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {p.nombre}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {p.categoria ?? 'Sin categoría'}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500">
                                    Stock: {p.stock_actual} (mín. {p.stock_minimo})
                                </span>
                                <Badge variant="warning">Reponer</Badge>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
};

export default Home;
