import { useState } from 'react';
import CategoriaForm from '../components/CategoriaForm';
import CategoriasTabla from '../components/CategoriasTabla';
import type { Categoria } from '../types/categoria.types';

const Categorias = () => {
    const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>(undefined);

    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);
    };

    const handleCancelEdit = () => {
        setEditingCategoria(undefined);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-5">
            <CategoriaForm
                key={editingCategoria?.id ?? 'create'}
                categoria={editingCategoria}
                onCancel={handleCancelEdit}
            />
            <CategoriasTabla onEdit={handleEdit} />
        </div>
    );
};

export default Categorias;