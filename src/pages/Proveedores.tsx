import { useState } from 'react';
import ProveedorForm from '../components/ProveedorForm';
import ProveedoresTabla from '../components/ProveedoresTabla';
import type { Proveedor } from '../types/proveedor.types';

const Proveedores = () => {
    const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>(undefined);

    const handleEdit = (proveedor: Proveedor) => {
        setEditingProveedor(proveedor);
    };

    const handleCancelEdit = () => {
        setEditingProveedor(undefined);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-5">
            <ProveedorForm
                key={editingProveedor?.id ?? 'create'}
                proveedor={editingProveedor}
                onCancel={handleCancelEdit}
            />
            <ProveedoresTabla onEdit={handleEdit} />
        </div>
    );
};

export default Proveedores;