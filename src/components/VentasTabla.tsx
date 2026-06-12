import { useVentas } from '../hooks/useVenta';

const VentasTabla = () => {
    const { data: ventas, isLoading } = useVentas();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            N° Factura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vendedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                Cargando...
                            </td>
                        </tr>
                    ) : ventas && ventas.length > 0 ? (
                        ventas.map((venta) => (
                            <tr key={venta.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {venta.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                    {venta.numero_factura}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {venta.cliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {venta.usuario_sistema}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                    ${Number(venta.total).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            venta.estado === 'completado'
                                                ? 'bg-green-100 text-green-700'
                                                : venta.estado === 'pendiente'
                                                  ? 'bg-yellow-100 text-yellow-700'
                                                  : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {venta.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(venta.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                No hay ventas registradas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VentasTabla;
