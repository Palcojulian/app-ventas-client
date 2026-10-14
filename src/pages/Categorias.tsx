import { useState } from 'react';
import CategoriaForm from '../components/CategoriaForm';
import CategoriasTabla from '../components/CategoriasTabla';
import type { Categoria } from '../types/categoria.types';

const Categorias = () => {
    const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>(undefined);

    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingCategoria(undefined);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-5 items-start">
            <div className="w-full xl:w-[360px] xl:flex-shrink-0">
                <CategoriaForm
                    key={editingCategoria?.id ?? 'create'}
                    categoria={editingCategoria}
                    onCancel={handleCancelEdit}
                />
            </div>
            <div className="w-full flex-1 min-w-0">
                <CategoriasTabla onEdit={handleEdit} />
            </div>
        </div>
    );
};

export default Categorias;
