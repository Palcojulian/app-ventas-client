import { useState } from 'react';
import ProveedorForm from '../components/ProveedorForm';
import ProveedoresTabla from '../components/ProveedoresTabla';
import type { Proveedor } from '../types/proveedor.types';

const Proveedores = () => {
    const [editingProveedor, setEditingProveedor] = useState<Proveedor | undefined>(undefined);

    const handleEdit = (proveedor: Proveedor) => {
        setEditingProveedor(proveedor);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProveedor(undefined);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-5 items-start">
            <div className="w-full xl:w-[400px] xl:flex-shrink-0">
                <ProveedorForm
                    key={editingProveedor?.id ?? 'create'}
                    proveedor={editingProveedor}
                    onCancel={handleCancelEdit}
                />
            </div>
            <div className="w-full flex-1 min-w-0">
                <ProveedoresTabla onEdit={handleEdit} />
            </div>
        </div>
    );
};

export default Proveedores;
