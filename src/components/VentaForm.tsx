import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateVenta } from '../hooks/useVenta';
import { useProductos } from '../hooks/useProducto';
import { getData } from '../utils/storage';
import type { User } from '../types/auth.types';
import type { DetalleVentaPayload, Producto } from '../types/venta.types';
import { METODOS_PAGO, ESTADOS_VENTA } from '../types/venta.types';
import { SearchableSelect } from './SearchableSelect';

interface DetalleUI extends DetalleVentaPayload {
    precio_unitario: number;
}

const VentaForm = () => {
    const user = getData<User>('auth-user');
    const id_cliente = user?.id ?? 0;

    const [metodo_pago, setMetodoPago] = useState('efectivo');
    const [estado, setEstado] = useState('completado');
    const [detalles, setDetalles] = useState<DetalleUI[]>([
        { id_producto: 0, cantidad: 1, precio_unitario: 0 },
    ]);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: productos } = useProductos();

    const { create, isLoading, isError, error } = useCreateVenta(() => {
        setMetodoPago('efectivo');
        setEstado('completado');
        setDetalles([{ id_producto: 0, cantidad: 1, precio_unitario: 0 }]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    });

    const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0);

    const handleAddDetalle = () => {
        setDetalles([...detalles, { id_producto: 0, cantidad: 1, precio_unitario: 0 }]);
    };

    const handleRemoveDetalle = (index: number) => {
        if (detalles.length > 1) {
            setDetalles(detalles.filter((_, i) => i !== index));
        }
    };

    const handleProductoChange = (index: number, idProducto: number) => {
        const producto: Producto | undefined = productos?.find((p) => p.id === idProducto);
        const newDetalles = [...detalles];
        newDetalles[index] = {
            ...newDetalles[index],
            id_producto: idProducto,
            precio_unitario: producto ? producto.precio_venta : 0,
        };
        setDetalles(newDetalles);
    };

    const handleCantidadChange = (index: number, cantidad: number) => {
        const newDetalles = [...detalles];
        newDetalles[index] = { ...newDetalles[index], cantidad };
        setDetalles(newDetalles);
    };

    const getAvailableProducts = (currentIndex: number) => {
        const selectedIds = detalles
            .filter((_, i) => i !== currentIndex)
            .map((d) => d.id_producto)
            .filter((id) => id > 0);
        return productos?.filter((p) => !selectedIds.includes(p.id)) ?? [];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id_cliente,
            impuestos: 0,
            descuento: 0,
            metodo_pago,
            estado,
            detalles: detalles.filter(
                (d) => d.id_producto > 0 && d.cantidad > 0 && d.precio_unitario > 0,
            ),
        };
        create(payload);
    };

    const handleReset = () => {
        setMetodoPago('efectivo');
        setEstado('completado');
        setDetalles([{ id_producto: 0, cantidad: 1, precio_unitario: 0 }]);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl min-w-md h-full"
        >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Registrar Venta</h3>

            {!user && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-100">
                    No hay un usuario autenticado. Inicia sesión para registrar ventas.
                </div>
            )}

            {user && (
                <div className="mb-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm border border-indigo-100">
                    Vendedor: <span className="font-medium">{user.name}</span> ({user.email})
                </div>
            )}

            {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                    Venta registrada exitosamente
                </div>
            )}

            {isError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    <p className="font-medium">
                        {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error'}
                    </p>
                    <p>
                        {(error as { response?: { data?: { errores?: string } } })?.response?.data?.errores}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label
                        htmlFor="metodo_pago"
                        className="block text-gray-600 text-sm font-medium mb-2"
                    >
                        Método de Pago
                    </label>
                    <select
                        id="metodo_pago"
                        value={metodo_pago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        required
                    >
                        {METODOS_PAGO.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="estado" className="block text-gray-600 text-sm font-medium mb-2">
                        Estado
                    </label>
                    <select
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        required
                    >
                        {ESTADOS_VENTA.map((e) => (
                            <option key={e.value} value={e.value}>
                                {e.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-600 text-sm font-medium">
                        Detalles de la Venta
                    </label>
                    <button
                        type="button"
                        onClick={handleAddDetalle}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors hover:cursor-pointer"
                    >
                        <Plus width={16} height={16} />
                        Agregar producto
                    </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Producto
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">
                                    Cantidad
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">
                                    Precio Unit.
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">
                                    Subtotal
                                </th>
                                <th className="px-4 py-2 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {detalles.map((detalle, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">
                                        <SearchableSelect
                                            value={detalle.id_producto}
                                            onChange={(val) => handleProductoChange(index, val)}
                                            clearValue={0}
                                            placeholder="Buscar producto..."
                                            searchPlaceholder="Buscar por nombre o código..."
                                            required
                                            options={getAvailableProducts(index).map((prod) => ({
                                                value: prod.id,
                                                label: `${prod.nombre} (${prod.codigo})`,
                                                subLabel: `Stock: ${prod.stock_actual}`,
                                            }))}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={detalle.cantidad}
                                            onChange={(e) =>
                                                handleCantidadChange(index, Number(e.target.value))
                                            }
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                            required
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={detalle.precio_unitario}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600 font-medium">
                                        ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDetalle(index)}
                                            disabled={detalles.length === 1}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                                        >
                                            <Trash2 width={18} height={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Total:</span>
                <span className="text-xl font-bold text-gray-700">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isLoading || !user}
                    className="flex-1 bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? 'Guardando...' : 'Registrar Venta'}
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors font-medium"
                >
                    Limpiar
                </button>
            </div>
        </form>
    );
};

export default VentaForm;
