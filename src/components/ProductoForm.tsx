import { useState } from 'react';
import { useCreateProducto, useUpdateProducto } from '../hooks/useProducto';
import { useCategorias } from '../hooks/useCategoria';
import type { Producto } from '../types/producto.types';
interface ProductoFormProps {
    producto?: Producto;
    onCancel?: () => void;
}

const ProductoForm = ({ producto, onCancel }: ProductoFormProps) => {
    const isEditMode = !!producto;
    const { data: categorias } = useCategorias();

    const [nombre, setNombre] = useState(producto?.nombre ?? '');
    const [descripcion, setDescripcion] = useState(producto?.descripcion ?? '');
    const [id_categoria, setIdCategoria] = useState(producto?.id_categoria ?? 0);
    const [precio_venta, setPrecioVenta] = useState(producto?.precio_venta ?? 0);
    const [costo, setCosto] = useState(producto?.costo ?? 0);
    const [stock_actual, setStockActual] = useState(producto?.stock_actual ?? 0);
    const [stock_minimo, setStockMinimo] = useState(producto?.stock_minimo ?? 0);
    const [estado, setEstado] = useState(producto?.estado ?? 'activo');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSuccess = () => {
        setNombre('');
        setDescripcion('');
        setIdCategoria(0);
        setPrecioVenta(0);
        setCosto(0);
        setStockActual(0);
        setStockMinimo(0);
        setEstado('activo');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onCancel?.();
    };

    const { create, isLoading: isCreating, isError: isCreateError, error: createError } = useCreateProducto(handleSuccess);
    const { update, isLoading: isUpdating } = useUpdateProducto(handleSuccess);

    const isLoading = isCreating || isUpdating;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = { 
            nombre, 
            descripcion, 
            id_categoria, 
            precio_venta, 
            costo, 
            stock_actual, 
            stock_minimo, 
            estado 
        };

        if (isEditMode && producto) {
            const confirmed = window.confirm('¿Está seguro de editar el producto?');
            if (confirmed) {
                update({ id: producto.id, payload });
            }
        } else {
            create(payload);
        }
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

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 w-full lg:max-w-lg lg:min-w-md lg:h-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {isEditMode ? 'Editar Producto' : 'Crear Producto'}
            </h3>

            {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                    {isEditMode ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente'}
                </div>
            )}

            {isCreateError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    <p>{(createError as { response?: { data?: { error?: string } } })?.response?.data?.error}</p>
                    <p className="font-medium">{(createError as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Error'}</p>
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="nombre" className="block text-gray-600 text-sm font-medium mb-2">Nombre</label>
                <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nombre del producto"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="descripcion" className="block text-gray-600 text-sm font-medium mb-2">Descripción</label>
                <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Descripción del producto"
                    rows={2}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="id_categoria" className="block text-gray-600 text-sm font-medium mb-2">Categoría</label>
                <select
                    id="id_categoria"
                    value={id_categoria}
                    onChange={(e) => setIdCategoria(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isEditMode ? true : false}
                >
                    <option value={0}>Seleccione una categoría</option>
                    {categorias?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="precio_venta" className="block text-gray-600 text-sm font-medium mb-2">Precio Venta</label>
                    <input
                        type="number"
                        step="0.01"
                        id="precio_venta"
                        value={precio_venta}
                        onChange={(e) => setPrecioVenta(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="0.00"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="costo" className="block text-gray-600 text-sm font-medium mb-2">Costo</label>
                    <input
                        type="number"
                        step="0.01"
                        id="costo"
                        value={costo}
                        onChange={(e) => setCosto(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="stock_actual" className="block text-gray-600 text-sm font-medium mb-2">Stock Actual</label>
                    <input
                        type="number"
                        id="stock_actual"
                        value={stock_actual}
                        onChange={(e) => setStockActual(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="0"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="stock_minimo" className="block text-gray-600 text-sm font-medium mb-2">Stock Mínimo</label>
                    <input
                        type="number"
                        id="stock_minimo"
                        value={stock_minimo}
                        onChange={(e) => setStockMinimo(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="0"
                        required
                    />
                </div>
            </div>

            {
                isEditMode && (
                    <div className="mb-6">
                        <label htmlFor="estado" className="block text-gray-600 text-sm font-medium mb-2">Estado</label>
                        <select
                            id="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                            required
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                )
            }

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                    {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
                </button>
                {isEditMode && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                )}
                {!isEditMode && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:cursor-pointer transition-colors font-medium"
                    >
                        Limpiar
                    </button>
                )}
            </div>
        </form>
    );
};

export default ProductoForm;