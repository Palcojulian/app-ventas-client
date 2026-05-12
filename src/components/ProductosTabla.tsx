import { Pencil } from 'lucide-react';
import { useProductos } from '../hooks/useProducto';
import type { Producto } from '../types/producto.types';

interface ProductosTablaProps {
    onEdit: (producto: Producto) => void;
}

const ProductosTabla = ({ onEdit }: ProductosTablaProps) => {
    const { data: productos, isLoading } = useProductos();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Und.</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={10} className="px-4 py-4 text-center text-gray-500">Cargando...</td>
                        </tr>
                    ) : productos && productos.length > 0 ? (
                        productos.map((producto) => (
                            <tr key={producto.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{producto.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{producto.codigo}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{producto.nombre}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{producto.categoria ?? '-'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">${producto.precio_venta.toFixed(2)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">${producto.costo.toFixed(2)}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{producto.stock_actual}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{producto.unidad_medida}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${producto.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {producto.estado}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onEdit(producto)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 hover:cursor-pointer rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil width={18} height={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="px-4 py-4 text-center text-gray-500">No hay productos registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductosTabla;