import { Pencil } from 'lucide-react';
import { useProductos } from '../hooks/useProducto';
import Badge from './ui/Badge';
import { estadoToVariant } from './ui/badge-helpers';
import EmptyState from './ui/EmptyState';
import Button from './ui/Button';
import type { Producto } from '../types/producto.types';

interface ProductosTablaProps {
    onEdit: (producto: Producto) => void;
}

const ProductosTabla = ({ onEdit }: ProductosTablaProps) => {
    const { data: productos, isLoading } = useProductos();

    const stockBadge = (actual: number, minimo: number) => {
        if (actual <= 0) return { variant: 'danger' as const, label: 'Sin stock' };
        if (actual <= minimo) return { variant: 'warning' as const, label: 'Stock bajo' };
        return { variant: 'success' as const, label: 'OK' };
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
            <div className="hidden sm:block overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[760px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Código</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Categoría</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Costo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <tr key={`skel-${i}`}>
                                      {Array.from({ length: 9 }).map((__, j) => (
                                          <td key={j} className="px-4 py-3">
                                              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                          </td>
                                      ))}
                                  </tr>
                              ))
                            : productos && productos.length > 0
                              ? productos.map((producto) => {
                                    const stock = stockBadge(
                                        producto.stock_actual,
                                        producto.stock_minimo,
                                    );
                                    return (
                                        <tr
                                            key={producto.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-500">{producto.id}</td>
                                            <td className="px-4 py-3 text-sm font-mono text-gray-700 hidden md:table-cell">
                                                {producto.codigo}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {producto.nombre}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                                {producto.categoria ?? '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                ${producto.precio_venta.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                                ${producto.costo.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={stock.variant}>{stock.label}</Badge>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {producto.stock_actual}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={estadoToVariant(producto.estado)}>
                                                    {producto.estado}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => onEdit(producto)}
                                                    className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors hover:cursor-pointer"
                                                    title="Editar"
                                                    aria-label={`Editar ${producto.nombre}`}
                                                >
                                                    <Pencil width={16} height={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                              : (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-10">
                                            <EmptyState
                                                title="Sin productos"
                                                description="Aún no hay productos en el inventario."
                                            />
                                        </td>
                                    </tr>
                                )}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden divide-y divide-gray-100">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={`skel-${i}`} className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                    ))
                ) : productos && productos.length > 0 ? (
                    productos.map((producto) => {
                        const stock = stockBadge(producto.stock_actual, producto.stock_minimo);
                        return (
                            <div key={producto.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                {producto.nombre}
                                            </h4>
                                            <Badge variant={estadoToVariant(producto.estado)}>
                                                {producto.estado}
                                            </Badge>
                                        </div>
                                        <p className="mt-0.5 text-xs text-gray-500">
                                            #{producto.id} · {producto.codigo}
                                            {producto.categoria ? ` · ${producto.categoria}` : ''}
                                        </p>
                                        <div className="mt-2 flex items-center gap-3 text-xs">
                                            <span className="text-gray-600">
                                                Precio:{' '}
                                                <span className="font-semibold text-gray-900">
                                                    ${producto.precio_venta.toFixed(2)}
                                                </span>
                                            </span>
                                            <Badge variant={stock.variant}>
                                                {producto.stock_actual} u · {stock.label}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(producto)}
                                        aria-label={`Editar ${producto.nombre}`}
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <EmptyState
                        title="Sin productos"
                        description="Aún no hay productos en el inventario."
                    />
                )}
            </div>
        </div>
    );
};

export default ProductosTabla;
