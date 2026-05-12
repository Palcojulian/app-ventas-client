import { useState } from 'react';
import { useCreateProveedor, useUpdateProveedor } from '../hooks/useProveedor';
import type { Proveedor } from '../types/proveedor.types';

interface ProveedorFormProps {
    proveedor?: Proveedor;
    onCancel?: () => void;
}

const ProveedorForm = ({ proveedor, onCancel }: ProveedorFormProps) => {
    const isEditMode = !!proveedor;
    const [nombre, setNombre] = useState(proveedor?.nombre ?? '');
    const [contacto, setContacto] = useState(proveedor?.contacto ?? '');
    const [telefono, setTelefono] = useState(proveedor?.telefono ?? '');
    const [email, setEmail] = useState(proveedor?.email ?? '');
    const [estado, setEstado] = useState(proveedor?.estado ?? 'activo');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSuccess = () => {
        setNombre('');
        setContacto('');
        setTelefono('');
        setEmail('');
        setEstado('activo');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onCancel?.();
    };

    const { create, isLoading: isCreating } = useCreateProveedor(handleSuccess);
    const { update, isLoading: isUpdating } = useUpdateProveedor(handleSuccess);

    const isLoading = isCreating || isUpdating;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { nombre, contacto, telefono, email, estado };
        if (isEditMode && proveedor) {
            const confirmed = window.confirm('¿Está seguro de editar el proveedor?');
            if (confirmed) {
                update({ id: proveedor.id, payload });
            }
        } else {
            create(payload);
        }
    };

    const handleReset = () => {
        setNombre('');
        setContacto('');
        setTelefono('');
        setEmail('');
        setEstado('activo');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg min-w-md h-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {isEditMode ? 'Editar Proveedor' : 'Crear Proveedor'}
            </h3>

            {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                    {isEditMode ? 'Proveedor actualizado exitosamente' : 'Proveedor creado exitosamente'}
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
                    placeholder="Nombre del proveedor"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="contacto" className="block text-gray-600 text-sm font-medium mb-2">Contacto</label>
                <input
                    type="text"
                    id="contacto"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nombre del contacto"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="telefono" className="block text-gray-600 text-sm font-medium mb-2">Teléfono</label>
                <input
                    type="text"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Teléfono del proveedor"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="email@ejemplo.com"
                    required
                />
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

export default ProveedorForm;