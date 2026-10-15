import { useState } from 'react';
import { Upload } from 'lucide-react';
import ProductoForm from '../components/ProductoForm';
import ProductosTabla from '../components/ProductosTabla';
import ImportarProductosModal from '../components/ImportarProductosModal';
import Button from '../components/ui/Button';
import type { Producto } from '../types/producto.types';

const Productos = () => {
    const [editingProducto, setEditingProducto] = useState<Producto | undefined>(undefined);
    const [importarOpen, setImportarOpen] = useState(false);

    const handleEdit = (producto: Producto) => {
        setEditingProducto(producto);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProducto(undefined);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Productos</h1>
                    <p className="text-sm text-gray-500">
                        Gestiona el catálogo y carga productos de forma masiva desde Excel.
                    </p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<Upload size={16} />}
                    onClick={() => setImportarOpen(true)}
                >
                    Importar Excel
                </Button>
            </div>

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

            <ImportarProductosModal
                open={importarOpen}
                onClose={() => setImportarOpen(false)}
            />
        </div>
    );
};

export default Productos;
