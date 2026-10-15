import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2, DollarSign, RefreshCw, Save, Loader2, ListOrdered } from 'lucide-react';
import { useCreateVenta } from '../hooks/useVenta';
import { useProductos } from '../hooks/useProducto';
import { getData } from '../utils/storage';
import type { User } from '../types/auth.types';
import type { DetalleVentaPayload, Producto } from '../types/venta.types';
import { METODOS_PAGO, ESTADOS_VENTA } from '../types/venta.types';
import { SearchableSelect } from './SearchableSelect';
import { useToast } from './ui/useToast';
import Card from './ui/Card';
import Select from './ui/Select';
import Button from './ui/Button';

interface DetalleUI extends DetalleVentaPayload {
    tempId: number;
    precio_unitario: number;
}

const VentaForm = () => {
    const user = getData<User>('auth-user');
    const id_cliente = user?.id ?? 0;
    const toast = useToast();

    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [estado, setEstado] = useState('completado');
    const [detalles, setDetalles] = useState<DetalleUI[]>([
        { tempId: 1, id_producto: 0, cantidad: 1, precio_unitario: 0 },
    ]);

    const { data: productos } = useProductos();

    const { create, isLoading, error } = useCreateVenta(() => {
        setMetodoPago('efectivo');
        setEstado('completado');
        setDetalles([{ tempId: Date.now(), id_producto: 0, cantidad: 1, precio_unitario: 0 }]);
        toast.success('Venta registrada exitosamente');
    });

    const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0);

    const handleAddDetalle = () => {
        setDetalles((prev) => [
            ...prev,
            {
                tempId: Date.now() + Math.random(),
                id_producto: 0,
                cantidad: 1,
                precio_unitario: 0,
            },
        ]);
    };

    const handleRemoveDetalle = (tempId: number) => {
        if (detalles.length > 1) {
            setDetalles((prev) => prev.filter((d) => d.tempId !== tempId));
        }
    };

    const handleProductoChange = (tempId: number, idProducto: number) => {
        const producto: Producto | undefined = productos?.find((p) => p.id === idProducto);
        setDetalles((prev) =>
            prev.map((d) =>
                d.tempId === tempId
                    ? {
                          ...d,
                          id_producto: idProducto,
                          precio_unitario: producto ? producto.precio_venta : 0,
                      }
                    : d,
            ),
        );
    };

    const handleCantidadChange = (tempId: number, cantidad: number) => {
        setDetalles((prev) =>
            prev.map((d) => (d.tempId === tempId ? { ...d, cantidad } : d)),
        );
    };

    const getAvailableProducts = (currentTempId: number) => {
        const selectedIds = detalles
            .filter((d) => d.tempId !== currentTempId)
            .map((d) => d.id_producto)
            .filter((id) => id > 0);
        return productos?.filter((p) => !selectedIds.includes(p.id)) ?? [];
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            id_cliente,
            impuestos: 0,
            descuento: 0,
            metodo_pago: metodoPago,
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
        setDetalles([{ tempId: Date.now(), id_producto: 0, cantidad: 1, precio_unitario: 0 }]);
    };

    const serverErrorMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    const serverErrorDetails = (error as { response?: { data?: { errores?: string } } })?.response?.data?.errores;

    return (
        <Card>
            <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign size={18} />
                        Registrar venta
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Selecciona los productos vendidos y completa los datos.
                    </p>
                </div>
            </div>

            {!user && (
                <div
                    role="alert"
                    className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 text-sm"
                >
                    No hay un usuario autenticado. Inicia sesión para registrar ventas.
                </div>
            )}

            {user && (
                <div className="mb-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 text-sm">
                    <span className="font-medium">Vendedor:</span> {user.name} ·{' '}
                    <span className="text-indigo-600">{user.email}</span>
                </div>
            )}

            {(serverErrorMsg || serverErrorDetails) && (
                <div
                    role="alert"
                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
                >
                    {serverErrorMsg && <p className="font-medium">{serverErrorMsg}</p>}
                    {serverErrorDetails && <p className="mt-1">{serverErrorDetails}</p>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                        label="Método de pago"
                        id="metodo_pago"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        options={METODOS_PAGO}
                        required
                    />
                    <Select
                        label="Estado"
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        options={ESTADOS_VENTA}
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <ListOrdered size={14} /> Detalles de la venta
                        </label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleAddDetalle}
                            leftIcon={<Plus size={14} />}
                        >
                            Agregar producto
                        </Button>
                    </div>

                    <div className="space-y-3 md:hidden">
                        {detalles.map((detalle) => (
                            <div
                                key={detalle.tempId}
                                className="rounded-xl border border-gray-200 p-3 bg-gray-50/50 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-xs font-medium text-gray-500">
                                        Producto #{detalles.indexOf(detalle) + 1}
                                    </span>
                                    {detalles.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDetalle(detalle.tempId)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 hover:cursor-pointer"
                                            aria-label="Eliminar producto"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Producto
                                    </label>
                                    <SearchableSelect
                                        value={detalle.id_producto}
                                        onChange={(val) => handleProductoChange(detalle.tempId, val)}
                                        clearValue={0}
                                        placeholder="Seleccionar producto..."
                                        title="Seleccionar producto"
                                        searchPlaceholder="Buscar por nombre o código..."
                                        required
                                        options={getAvailableProducts(detalle.tempId).map((prod) => ({
                                            value: prod.id,
                                            label: `${prod.codigo} - ${prod.nombre}`,
                                            subLabel: `Stock: ${prod.stock_actual}`,
                                        }))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <MobileInput
                                        label="Cantidad"
                                        type="number"
                                        min={1}
                                        value={detalle.cantidad}
                                        onChange={(v) => handleCantidadChange(detalle.tempId, v)}
                                    />
                                    <MobileInput
                                        label="Precio unit."
                                        value={detalle.precio_unitario}
                                        readOnly
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                    <span className="text-xs text-gray-500">Subtotal</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full min-w-[640px]">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                                            Producto
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase w-24">
                                            Cantidad
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase w-28">
                                            Precio
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase w-28">
                                            Subtotal
                                        </th>
                                        <th className="px-4 py-2.5 w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {detalles.map((detalle) => (
                                        <tr key={detalle.tempId}>
                                            <td className="px-4 py-2">
                                                <SearchableSelect
                                                    value={detalle.id_producto}
                                                    onChange={(val) =>
                                                        handleProductoChange(detalle.tempId, val)
                                                    }
                                                    clearValue={0}
                                                    placeholder="Seleccionar producto..."
                                                    title="Seleccionar producto"
                                                    searchPlaceholder="Buscar por nombre o código..."
                                                    required
                                                    options={getAvailableProducts(detalle.tempId).map(
                                                        (prod) => ({
                                                            value: prod.id,
                                                            label: `${prod.codigo} - ${prod.nombre}`,
                                                            subLabel: `Stock: ${prod.stock_actual}`,
                                                        }),
                                                    )}
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={detalle.cantidad}
                                                    onChange={(e) =>
                                                        handleCantidadChange(
                                                            detalle.tempId,
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                    required
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={detalle.precio_unitario}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                                                ${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveDetalle(detalle.tempId)}
                                                    disabled={detalles.length === 1}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                                                    aria-label="Eliminar producto"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
                    <span className="text-sm font-semibold text-gray-700">Total de la venta</span>
                    <span className="text-2xl font-bold text-indigo-700">${total.toFixed(2)}</span>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        fullWidth
                        leftIcon={<RefreshCw size={16} />}
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || !user}
                        fullWidth
                        leftIcon={
                            isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />
                        }
                    >
                        {isLoading ? 'Guardando...' : 'Registrar venta'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const MobileInput = ({
    label,
    type = 'text',
    value,
    onChange,
    min,
    readOnly,
}: {
    label: string;
    type?: string;
    value: number;
    onChange?: (v: number) => void;
    min?: number;
    readOnly?: boolean;
}) => {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                min={min}
                value={value}
                readOnly={readOnly}
                onChange={(e) => onChange?.(Number(e.target.value))}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${readOnly ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''}`}
            />
        </div>
    );
};

export default VentaForm;
