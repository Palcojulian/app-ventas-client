import { useState } from 'react';
import type { FormEvent } from 'react';
import { Hash, RefreshCw, Save, Edit3, Tag, FileText, Loader2 } from 'lucide-react';
import { useCreateCategoria, useUpdateCategoria } from '../hooks/useCategoria';
import { useToast } from './ui/useToast';
import { ConfirmModal } from './ui/Modal';
import Card from './ui/Card';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import Badge from './ui/Badge';
import type { Categoria } from '../types/categoria.types';

interface CategoriaFormProps {
    categoria?: Categoria;
    onCancel?: () => void;
}

const CategoriaForm = ({ categoria, onCancel }: CategoriaFormProps) => {
    const isEditMode = !!categoria;
    const toast = useToast();

    const [nombre, setNombre] = useState(categoria?.nombre ?? '');
    const [prefijo, setPrefijo] = useState(categoria?.prefijo ?? '');
    const [descripcion, setDescripcion] = useState(categoria?.descripcion ?? '');
    const [estado, setEstado] = useState(categoria?.estado ?? 'activo');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSuccess = (msg: string) => {
        setNombre('');
        setPrefijo('');
        setDescripcion('');
        setEstado('activo');
        toast.success(msg);
        onCancel?.();
    };

    const { create, isLoading: isCreating, error: createError } = useCreateCategoria(() =>
        handleSuccess('Categoría creada exitosamente'),
    );
    const { update, isLoading: isUpdating } = useUpdateCategoria(() =>
        handleSuccess('Categoría actualizada exitosamente'),
    );
    const isLoading = isCreating || isUpdating;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload = { nombre, prefijo, descripcion, estado };
        if (isEditMode && categoria) {
            setConfirmOpen(true);
        } else {
            create(payload);
        }
    };

    const handleConfirmUpdate = () => {
        if (!categoria) return;
        setConfirmOpen(false);
        update({ id: categoria.id, payload: { nombre, prefijo, descripcion, estado } });
    };

    const handleReset = () => {
        setNombre('');
        setPrefijo('');
        setDescripcion('');
        setEstado('activo');
    };

    const serverError = (createError as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;

    return (
        <>
            <Card>
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {isEditMode ? <Edit3 size={18} /> : <Tag size={18} />}
                            {isEditMode ? 'Editar categoría' : 'Nueva categoría'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditMode
                                ? 'Modifica los datos de la categoría seleccionada.'
                                : 'Crea una categoría para organizar tus productos.'}
                        </p>
                    </div>
                    {isEditMode && <Badge variant="warning">Editando</Badge>}
                </div>

                {serverError && (
                    <div
                        role="alert"
                        className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
                    >
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nombre"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Bebidas, Limpieza, etc."
                        required
                        disabled={isEditMode}
                        leftIcon={<Tag size={16} />}
                    />

                    <Input
                        label="Prefijo"
                        id="prefijo"
                        value={prefijo}
                        onChange={(e) => setPrefijo(e.target.value.toUpperCase())}
                        placeholder="Ej. BEB"
                        maxLength={10}
                        helper="Máx. 10 caracteres. Se usa para generar códigos."
                        required
                        disabled={isEditMode}
                        leftIcon={<Hash size={16} />}
                    />

                    <Textarea
                        label="Descripción"
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Describe brevemente la categoría"
                        required
                    />

                    {isEditMode && (
                        <Select
                            label="Estado"
                            id="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            options={[
                                { value: 'activo', label: 'Activo' },
                                { value: 'inactivo', label: 'Inactivo' },
                            ]}
                            required
                        />
                    )}

                    <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={isEditMode ? onCancel : handleReset}
                            fullWidth
                            leftIcon={<RefreshCw size={16} />}
                        >
                            {isEditMode ? 'Cancelar' : 'Limpiar'}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                            fullWidth
                            leftIcon={
                                isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : isEditMode ? (
                                    <Save size={16} />
                                ) : (
                                    <FileText size={16} />
                                )
                            }
                        >
                            {isLoading
                                ? 'Guardando...'
                                : isEditMode
                                  ? 'Actualizar'
                                  : 'Guardar categoría'}
                        </Button>
                    </div>
                </form>
            </Card>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                title="¿Editar categoría?"
                description="Vas a modificar los datos de esta categoría. El cambio se registrará inmediatamente."
                confirmText="Sí, editar"
                cancelText="Cancelar"
                loading={isUpdating}
            />
        </>
    );
};

export default CategoriaForm;
