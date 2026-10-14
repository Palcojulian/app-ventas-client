import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    Package,
    RefreshCw,
    Save,
    Loader2,
    Edit3,
    Tag,
    DollarSign,
    Boxes,
} from 'lucide-react';
import { useCreateProducto, useUpdateProducto } from '../hooks/useProducto';
import { useCategorias } from '../hooks/useCategoria';
import { useToast } from './ui/useToast';
import { ConfirmModal } from './ui/Modal';
import Card from './ui/Card';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import Badge from './ui/Badge';
import type { Producto } from '../types/producto.types';

interface ProductoFormProps {
    producto?: Producto;
    onCancel?: () => void;
}

const ProductoForm = ({ producto, onCancel }: ProductoFormProps) => {
    const isEditMode = !!producto;
    const toast = useToast();
    const { data: categorias } = useCategorias();

    const [nombre, setNombre] = useState(producto?.nombre ?? '');
    const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '');
    const [idCategoria, setIdCategoria] = useState<number>(producto?.id_categoria ?? 0);
    const [precioVenta, setPrecioVenta] = useState(producto?.precio_venta ?? 0);
    const [costo, setCosto] = useState(producto?.costo ?? 0);
    const [stockActual, setStockActual] = useState(producto?.stock_actual ?? 0);
    const [stockMinimo, setStockMinimo] = useState(producto?.stock_minimo ?? 0);
    const [estado, setEstado] = useState(producto?.estado ?? 'activo');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSuccess = (msg: string) => {
        setNombre('');
        setDescripcion('');
        setIdCategoria(0);
        setPrecioVenta(0);
        setCosto(0);
        setStockActual(0);
        setStockMinimo(0);
        setEstado('activo');
        toast.success(msg);
        onCancel?.();
    };

    const { create, isLoading: isCreating, error: createError } = useCreateProducto(() =>
        handleSuccess('Producto creado exitosamente'),
    );
    const { update, isLoading: isUpdating } = useUpdateProducto(() =>
        handleSuccess('Producto actualizado exitosamente'),
    );
    const isLoading = isCreating || isUpdating;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            nombre,
            descripcion,
            id_categoria: idCategoria,
            precio_venta: precioVenta,
            costo,
            stock_actual: stockActual,
            stock_minimo: stockMinimo,
            estado,
        };
        if (isEditMode && producto) {
            setConfirmOpen(true);
        } else {
            create(payload);
        }
    };

    const handleConfirmUpdate = () => {
        if (!producto) return;
        setConfirmOpen(false);
        update({
            id: producto.id,
            payload: {
                nombre,
                descripcion,
                id_categoria: idCategoria,
                precio_venta: precioVenta,
                costo,
                stock_actual: stockActual,
                stock_minimo: stockMinimo,
                estado,
            },
        });
    };

    const handleReset = () => {
        setNombre('');
        setDescripcion('');
        setIdCategoria(0);
        setPrecioVenta(0);
        setCosto(0);
        setStockActual(0);
        setStockMinimo(0);
        setEstado('activo');
    };

    const serverError = (createError as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;

    const categoriaOptions = [
        { value: 0, label: 'Selecciona una categoría' },
        ...(categorias?.map((c) => ({ value: c.id, label: c.nombre })) ?? []),
    ];

    return (
        <>
            <Card>
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {isEditMode ? <Edit3 size={18} /> : <Package size={18} />}
                            {isEditMode ? 'Editar producto' : 'Nuevo producto'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditMode
                                ? 'Modifica los datos del producto.'
                                : 'Registra un nuevo producto en el inventario.'}
                        </p>
                    </div>
                    {isEditMode && <Badge variant="warning">Editando</Badge>}
                </div>

                {serverError && (
                    <div
                        role="alert"
                        className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
                    >
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nombre del producto"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Coca Cola 600ml"
                        required
                        leftIcon={<Tag size={16} />}
                    />

                    <Textarea
                        label="Descripción"
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Describe brevemente el producto"
                        rows={2}
                        required
                    />

                    <Select
                        label="Categoría"
                        id="id_categoria"
                        value={idCategoria}
                        onChange={(e) => setIdCategoria(Number(e.target.value))}
                        options={categoriaOptions}
                        required
                        disabled={isEditMode}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Precio de venta"
                            id="precio_venta"
                            type="number"
                            step="0.01"
                            min="0"
                            value={precioVenta}
                            onChange={(e) => setPrecioVenta(Number(e.target.value))}
                            placeholder="0.00"
                            required
                            leftIcon={<DollarSign size={16} />}
                        />
                        <Input
                            label="Costo"
                            id="costo"
                            type="number"
                            step="0.01"
                            min="0"
                            value={costo}
                            onChange={(e) => setCosto(Number(e.target.value))}
                            placeholder="0.00"
                            required
                            leftIcon={<DollarSign size={16} />}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Stock actual"
                            id="stock_actual"
                            type="number"
                            min="0"
                            value={stockActual}
                            onChange={(e) => setStockActual(Number(e.target.value))}
                            placeholder="0"
                            required
                            leftIcon={<Boxes size={16} />}
                        />
                        <Input
                            label="Stock mínimo"
                            id="stock_minimo"
                            type="number"
                            min="0"
                            value={stockMinimo}
                            onChange={(e) => setStockMinimo(Number(e.target.value))}
                            placeholder="0"
                            required
                            leftIcon={<Boxes size={16} />}
                            helper="Alertará cuando el stock esté por debajo de este valor."
                        />
                    </div>

                    {isEditMode && (
                        <Select
                            label="Estado"
                            id="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            options={[
                                { value: 'activo', label: 'Activo' },
                                { value: 'inactivo', label: 'Inactivo' },
                            ]}
                            required
                        />
                    )}

                    <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={isEditMode ? onCancel : handleReset}
                            fullWidth
                            leftIcon={<RefreshCw size={16} />}
                        >
                            {isEditMode ? 'Cancelar' : 'Limpiar'}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            fullWidth
                            leftIcon={
                                isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Save size={16} />
                                )
                            }
                        >
                            {isLoading
                                ? 'Guardando...'
                                : isEditMode
                                  ? 'Actualizar'
                                  : 'Guardar producto'}
                        </Button>
                    </div>
                </form>
            </Card>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                title="¿Editar producto?"
                description="Vas a modificar los datos de este producto. El cambio se registrará inmediatamente."
                confirmText="Sí, editar"
                cancelText="Cancelar"
                loading={isUpdating}
            />
        </>
    );
};

export default ProductoForm;
