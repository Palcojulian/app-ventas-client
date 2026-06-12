import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateCompra } from '../hooks/useCompra';
import { useProveedores } from '../hooks/useProveedor';
import { useProductos } from '../hooks/useProducto';
import type { DetalleCompraPayload } from '../types/compra.types';

const CompraForm = () => {
    const [id_proveedor, setIdProveedor] = useState(0);
    const [estado, setEstado] = useState('pendiente');
    const [detalles, setDetalles] = useState<DetalleCompraPayload[]>([
        { id_producto: 0, cantidad: 1, costo_unitario: 0 }
    ]);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: proveedores } = useProveedores();
    const { data: productos } = useProductos();

    const { create, isLoading, isError, error } = useCreateCompra(() => {
        setIdProveedor(0);
        setEstado('pendiente');
        setDetalles([{ id_producto: 0, cantidad: 1, costo_unitario: 0 }]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    });

    const total = detalles.reduce((acc, d) => acc + (d.cantidad * d.costo_unitario), 0);

    const handleAddDetalle = () => {
        setDetalles([...detalles, { id_producto: 0, cantidad: 1, costo_unitario: 0 }]);
    };

    const handleRemoveDetalle = (index: number) => {
        if (detalles.length > 1) {
            setDetalles(detalles.filter((_, i) => i !== index));
        }
    };

    const handleDetalleChange = (index: number, field: keyof DetalleCompraPayload, value: number) => {
        const newDetalles = [...detalles];
        newDetalles[index] = { ...newDetalles[index], [field]: value };
        setDetalles(newDetalles);
    };

    const getAvailableProducts = (currentIndex: number) => {
        const selectedIds = detalles
            .filter((_, i) => i !== currentIndex)
            .map(d => d.id_producto)
            .filter(id => id > 0);
        return productos?.filter(p => !selectedIds.includes(p.id)) ?? [];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id_proveedor,
            estado,
            detalles: detalles.filter(d => d.id_producto > 0 && d.cantidad > 0 && d.costo_unitario > 0)
        };
        create(payload);
    };

    const handleReset = () => {
        setIdProveedor(0);
        setEstado('pendiente');
        setDetalles([{ id_producto: 0, cantidad: 1, costo_unitario: 0 }]);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 w-full max-w-4xl h-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Registrar Compra</h3>

            {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                    Compra registrada exitosamente
                </div>
            )}

            {isError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    <p className="font-medium">{(error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error'}</p>
                    <p>{(error as { response?: { data?: { errores?: string } } })?.response?.data?.errores}</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="id_proveedor" className="block text-gray-600 text-sm font-medium mb-2">Proveedor</label>
                    <select
                        id="id_proveedor"
                        value={id_proveedor}
                        onChange={(e) => setIdProveedor(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        required
                    >
                        <option value={0}>Seleccione un proveedor</option>
                        {proveedores?.map((prov) => (
                            <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="estado" className="block text-gray-600 text-sm font-medium mb-2">Estado</label>
                    <select
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                        required
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-600 text-sm font-medium">Detalles de la Compra</label>
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
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">Cantidad</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">Costo Unitario</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-32">Total</th>
                                    <th className="px-4 py-2 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {detalles.map((detalle, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            <select
                                                value={detalle.id_producto}
                                                onChange={(e) => handleDetalleChange(index, 'id_producto', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-sm"
                                                required
                                            >
                                                <option value={0}>Seleccione</option>
                                                {getAvailableProducts(index).map((prod) => (
                                                    <option key={prod.id} value={prod.id}>{prod.nombre} ({prod.codigo})</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={detalle.cantidad}
                                                onChange={(e) => handleDetalleChange(index, 'cantidad', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={detalle.costo_unitario}
                                                onChange={(e) => handleDetalleChange(index, 'costo_unitario', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600 font-medium">
                                            ${(detalle.cantidad * detalle.costo_unitario).toFixed(2)}
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
            </div>

            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Total:</span>
                <span className="text-xl font-bold text-gray-700">${total.toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? 'Guardando...' : 'Registrar Compra'}
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

export default CompraForm;