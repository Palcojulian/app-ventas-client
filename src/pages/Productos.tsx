import { useState } from 'react';
import ProductoForm from '../components/ProductoForm';
import ProductosTabla from '../components/ProductosTabla';
import type { Producto } from '../types/producto.types';

const Productos = () => {
    const [editingProducto, setEditingProducto] = useState<Producto | undefined>(undefined);

    const handleEdit = (producto: Producto) => {
        setEditingProducto(producto);
    };

    const handleCancelEdit = () => {
        setEditingProducto(undefined);
    };

    return (
        <div className="flex gap-5">
            <ProductoForm
                key={editingProducto?.id ?? 'create'}
                producto={editingProducto}
                onCancel={handleCancelEdit}
            />
            <ProductosTabla onEdit={handleEdit} />
        </div>
    );
};

export default Productos;