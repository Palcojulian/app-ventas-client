import { Pencil } from 'lucide-react';
import { useCategorias } from '../hooks/useCategoria';
import type { Categoria } from '../types/categoria.types';

interface CategoriasTablaProps {
    onEdit: (categoria: Categoria) => void;
}

const CategoriasTabla = ({ onEdit }: CategoriasTablaProps) => {
    const { data: categorias, isLoading } = useCategorias();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Prefijo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Fecha Creación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Cargando...</td>
                            </tr>
                        ) : categorias && categorias.length > 0 ? (
                            categorias.map((categoria) => (
                                <tr key={categoria.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{categoria.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{categoria.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">{categoria.prefijo ?? '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{categoria.descripcion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoria.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {categoria.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                                        {new Date(categoria.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onEdit(categoria)}
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
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No hay categorías registradas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriasTabla;
