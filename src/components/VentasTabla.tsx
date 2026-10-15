import { useVentas } from '../hooks/useVenta';
import Badge from './ui/Badge';
import { estadoToVariant } from './ui/badge-helpers';
import EmptyState from './ui/EmptyState';

const VentasTabla = () => {
    const { data: ventas, isLoading } = useVentas();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
            <div className="hidden sm:block overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Factura</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Vendedor</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <tr key={`skel-${i}`}>
                                      {Array.from({ length: 7 }).map((__, j) => (
                                          <td key={j} className="px-4 py-3">
                                              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                          </td>
                                      ))}
                                  </tr>
                              ))
                            : ventas && ventas.length > 0
                              ? ventas.map((venta) => (
                                    <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-500">{venta.id}</td>
                                        <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">
                                            {venta.numero_factura}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-[200px]">
                                            {venta.cliente}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                            {venta.usuario_sistema}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            ${Number(venta.total).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={estadoToVariant(venta.estado)}>
                                                {venta.estado}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                                            {new Date(venta.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                              : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10">
                                            <EmptyState
                                                title="Sin ventas registradas"
                                                description="Cuando registres una venta aparecerá aquí."
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
                ) : ventas && ventas.length > 0 ? (
                    ventas.map((venta) => (
                        <div key={venta.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-semibold text-gray-900 font-mono">
                                            {venta.numero_factura}
                                        </h4>
                                        <Badge variant={estadoToVariant(venta.estado)}>
                                            {venta.estado}
                                        </Badge>
                                    </div>
                                    <p className="mt-0.5 text-xs text-gray-500 truncate">
                                        Cliente: {venta.cliente}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Vendedor: {venta.usuario_sistema}
                                    </p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {new Date(venta.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-base font-bold text-indigo-700">
                                            ${Number(venta.total).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState
                        title="Sin ventas registradas"
                        description="Cuando registres una venta aparecerá aquí."
                    />
                )}
            </div>
        </div>
    );
};

export default VentasTabla;
