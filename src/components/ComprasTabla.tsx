import { useCompras } from '../hooks/useCompra';
import Badge from './ui/Badge';
import { estadoToVariant } from './ui/badge-helpers';
import EmptyState from './ui/EmptyState';

const ComprasTabla = () => {
    const { data: compras, isLoading } = useCompras();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
            <div className="hidden sm:block overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Contacto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Teléfono</th>
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
                            : compras && compras.length > 0
                              ? compras.map((compra) => (
                                    <tr key={compra.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-500">{compra.id}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                            {compra.proveedor ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                            {compra.contacto ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                                            {compra.telefono ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            ${Number(compra.total).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={estadoToVariant(compra.estado)}>
                                                {compra.estado}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                                            {new Date(compra.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                              : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10">
                                            <EmptyState
                                                title="Sin compras registradas"
                                                description="Cuando registres una compra aparecerá aquí."
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
                ) : compras && compras.length > 0 ? (
                    compras.map((compra) => (
                        <div key={compra.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {compra.proveedor ?? 'Sin proveedor'}
                                        </h4>
                                        <Badge variant={estadoToVariant(compra.estado)}>
                                            {compra.estado}
                                        </Badge>
                                    </div>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        #{compra.id} · {compra.contacto ?? '-'}
                                    </p>
                                    <p className="text-xs text-gray-500">{compra.telefono ?? '-'}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {new Date(compra.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-base font-bold text-indigo-700">
                                            ${Number(compra.total).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState
                        title="Sin compras registradas"
                        description="Cuando registres una compra aparecerá aquí."
                    />
                )}
            </div>
        </div>
    );
};

export default ComprasTabla;
