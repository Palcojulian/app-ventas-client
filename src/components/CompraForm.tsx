import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2, ShoppingCart, RefreshCw, Save, Loader2, Users } from 'lucide-react';
import { useCreateCompra } from '../hooks/useCompra';
import { useProveedores } from '../hooks/useProveedor';
import { useProductos } from '../hooks/useProducto';
import { useToast } from './ui/useToast';
import Card from './ui/Card';
import Select from './ui/Select';
import Button from './ui/Button';
import type { DetalleCompraPayload } from '../types/compra.types';

interface DetalleUI extends DetalleCompraPayload {
    tempId: number;
}

const CompraForm = () => {
    const toast = useToast();

    const [idProveedor, setIdProveedor] = useState(0);
    const [estado, setEstado] = useState('pendiente');
    const [detalles, setDetalles] = useState<DetalleUI[]>([
        { tempId: 1, id_producto: 0, cantidad: 1, costo_unitario: 0 },
    ]);

    const { data: proveedores } = useProveedores();
    const { data: productos } = useProductos();

    const { create, isLoading, error } = useCreateCompra(() => {
        setIdProveedor(0);
        setEstado('pendiente');
        setDetalles([{ tempId: Date.now(), id_producto: 0, cantidad: 1, costo_unitario: 0 }]);
        toast.success('Compra registrada exitosamente');
    });

    const total = detalles.reduce((acc, d) => acc + d.cantidad * d.costo_unitario, 0);

    const handleAddDetalle = () => {
        setDetalles((prev) => [
            ...prev,
            { tempId: Date.now() + Math.random(), id_producto: 0, cantidad: 1, costo_unitario: 0 },
        ]);
    };

    const handleRemoveDetalle = (tempId: number) => {
        if (detalles.length > 1) {
            setDetalles((prev) => prev.filter((d) => d.tempId !== tempId));
        }
    };

    const handleDetalleChange = (
        tempId: number,
        field: keyof DetalleCompraPayload,
        value: number,
    ) => {
        setDetalles((prev) =>
            prev.map((d) => (d.tempId === tempId ? { ...d, [field]: value } : d)),
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
            id_proveedor: idProveedor,
            estado,
            detalles: detalles.filter(
                (d) => d.id_producto > 0 && d.cantidad > 0 && d.costo_unitario > 0,
            ),
        };
        create(payload);
    };

    const handleReset = () => {
        setIdProveedor(0);
        setEstado('pendiente');
        setDetalles([{ tempId: Date.now(), id_producto: 0, cantidad: 1, costo_unitario: 0 }]);
    };

    const serverErrorMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    const serverErrorDetails = (error as { response?: { data?: { errores?: string } } })?.response?.data?.errores;

    const productoOptions = (currentTempId: number) => [
        { value: 0, label: 'Selecciona un producto' },
        ...getAvailableProducts(currentTempId).map((p) => ({
            value: p.id,
            label: `${p.nombre} (${p.codigo})`,
        })),
    ];

    return (
        <Card>
            <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <ShoppingCart size={18} />
                        Registrar compra
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Selecciona el proveedor y agrega los productos comprados.
                    </p>
                </div>
            </div>

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
                        label="Proveedor"
                        id="id_proveedor"
                        value={idProveedor}
                        onChange={(e) => setIdProveedor(Number(e.target.value))}
                        options={[
                            { value: 0, label: 'Selecciona un proveedor' },
                            ...(proveedores?.map((p) => ({ value: p.id, label: p.nombre })) ?? []),
                        ]}
                        required
                    />

                    <Select
                        label="Estado"
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        options={[
                            { value: 'pendiente', label: 'Pendiente' },
                            { value: 'completado', label: 'Completado' },
                            { value: 'cancelado', label: 'Cancelado' },
                        ]}
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <Users size={14} /> Detalles de la compra
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
                                <Select
                                    label="Producto"
                                    value={detalle.id_producto}
                                    onChange={(e) =>
                                        handleDetalleChange(
                                            detalle.tempId,
                                            'id_producto',
                                            Number(e.target.value),
                                        )
                                    }
                                    options={productoOptions(detalle.tempId)}
                                    containerClassName=""
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <InputField
                                        label="Cantidad"
                                        type="number"
                                        min={1}
                                        value={detalle.cantidad}
                                        onChange={(v) =>
                                            handleDetalleChange(detalle.tempId, 'cantidad', v)
                                        }
                                    />
                                    <InputField
                                        label="Costo unit."
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={detalle.costo_unitario}
                                        onChange={(v) =>
                                            handleDetalleChange(detalle.tempId, 'costo_unitario', v)
                                        }
                                    />
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                    <span className="text-xs text-gray-500">Subtotal</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        ${(detalle.cantidad * detalle.costo_unitario).toFixed(2)}
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
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase w-28">
                                            Cantidad
                                        </th>
                                        <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase w-32">
                                            Costo
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
                                                <select
                                                    value={detalle.id_producto}
                                                    onChange={(e) =>
                                                        handleDetalleChange(
                                                            detalle.tempId,
                                                            'id_producto',
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                    required
                                                >
                                                    {productoOptions(detalle.tempId).map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={detalle.cantidad}
                                                    onChange={(e) =>
                                                        handleDetalleChange(
                                                            detalle.tempId,
                                                            'cantidad',
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
                                                    min={0}
                                                    value={detalle.costo_unitario}
                                                    onChange={(e) =>
                                                        handleDetalleChange(
                                                            detalle.tempId,
                                                            'costo_unitario',
                                                            Number(e.target.value),
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                    required
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                                                ${(detalle.cantidad * detalle.costo_unitario).toFixed(2)}
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
                    <span className="text-sm font-semibold text-gray-700">Total a pagar</span>
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
                        disabled={isLoading}
                        fullWidth
                        leftIcon={
                            isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />
                        }
                    >
                        {isLoading ? 'Guardando...' : 'Registrar compra'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

// Helper local para inputs chicos dentro de tarjetas
const InputField = ({
    label,
    type,
    value,
    onChange,
    min,
    step,
}: {
    label: string;
    type: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    step?: string;
}) => {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input
                type={type}
                min={min}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                required
            />
        </div>
    );
};

export default CompraForm;
