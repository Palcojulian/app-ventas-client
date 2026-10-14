import { useState } from 'react';
import ProductoForm from '../components/ProductoForm';
import ProductosTabla from '../components/ProductosTabla';
import type { Producto } from '../types/producto.types';

const Productos = () => {
    const [editingProducto, setEditingProducto] = useState<Producto | undefined>(undefined);

    const handleEdit = (producto: Producto) => {
        setEditingProducto(producto);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProducto(undefined);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-5 items-start">
            <div className="w-full xl:w-[400px] xl:flex-shrink-0">
                <ProductoForm
                    key={editingProducto?.id ?? 'create'}
                    producto={editingProducto}
                    onCancel={handleCancelEdit}
                />
            </div>
            <div className="w-full flex-1 min-w-0">
                <ProductosTabla onEdit={handleEdit} />
            </div>
        </div>
    );
};

export default Productos;
