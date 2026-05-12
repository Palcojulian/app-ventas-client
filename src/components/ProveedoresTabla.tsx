import { Pencil } from 'lucide-react';
import { useProveedores } from '../hooks/useProveedor';
import type { Proveedor } from '../types/proveedor.types';

interface ProveedoresTablaProps {
    onEdit: (proveedor: Proveedor) => void;
}

const ProveedoresTabla = ({ onEdit }: ProveedoresTablaProps) => {
    const { data: proveedores, isLoading } = useProveedores();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500">Cargando...</td>
                        </tr>
                    ) : proveedores && proveedores.length > 0 ? (
                        proveedores.map((proveedor) => (
                            <tr key={proveedor.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{proveedor.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{proveedor.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{proveedor.contacto}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{proveedor.telefono}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{proveedor.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${proveedor.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {proveedor.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(proveedor.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onEdit(proveedor)}
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
                            <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No hay proveedores registrados</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProveedoresTabla;