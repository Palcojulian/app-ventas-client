import { useState } from 'react';
import { useCreateCategoria, useUpdateCategoria } from '../hooks/useCategoria';
import type { Categoria } from '../types/categoria.types';

interface CategoriaFormProps {
    categoria?: Categoria;
    onCancel?: () => void;
}

const CategoriaForm = ({ categoria, onCancel }: CategoriaFormProps) => {
    const isEditMode = !!categoria;
    const [nombre, setNombre] = useState(categoria?.nombre ?? '');
    const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? '');
    const [estado, setEstado] = useState(categoria?.estado ?? 'activo');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSuccess = () => {
        setNombre('');
        setDescripcion('');
        setEstado('activo');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onCancel?.();
    };

    const { create, isLoading: isCreating } = useCreateCategoria(handleSuccess);
    const { update, isLoading: isUpdating } = useUpdateCategoria(handleSuccess);

    const isLoading = isCreating || isUpdating;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { nombre, descripcion, estado };
        if (isEditMode && categoria) {
            const confirmed = window.confirm('¿Está seguro de editar la categoría?');
            if (confirmed) {
                update({ id: categoria.id, payload });
            }
        } else {
            create(payload);
        }
    };

    const handleReset = () => {
        setNombre('');
        setDescripcion('');
        setEstado('activo');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg min-w-md h-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {isEditMode ? 'Editar Categoría' : 'Crear Categoría'}
            </h3>

            {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">
                    {isEditMode ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente'}
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
                    placeholder="Nombre de la categoría"
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
                    placeholder="Descripción de la categoría"
                    rows={3}
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

export default CategoriaForm;