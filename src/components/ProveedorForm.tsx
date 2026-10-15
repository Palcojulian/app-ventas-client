import { useState } from 'react';
import type { FormEvent } from 'react';
import { Building2, Mail, Phone, RefreshCw, Save, Loader2, Edit3, User } from 'lucide-react';
import { useCreateProveedor, useUpdateProveedor } from '../hooks/useProveedor';
import { useToast } from './ui/useToast';
import { ConfirmModal } from './ui/Modal';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Badge from './ui/Badge';
import type { Proveedor } from '../types/proveedor.types';

interface ProveedorFormProps {
    proveedor?: Proveedor;
    onCancel?: () => void;
}

const ProveedorForm = ({ proveedor, onCancel }: ProveedorFormProps) => {
    const isEditMode = !!proveedor;
    const toast = useToast();

    const [nombre, setNombre] = useState(proveedor?.nombre ?? '');
    const [contacto, setContacto] = useState(proveedor?.contacto ?? '');
    const [telefono, setTelefono] = useState(proveedor?.telefono ?? '');
    const [email, setEmail] = useState(proveedor?.email ?? '');
    const [estado, setEstado] = useState(proveedor?.estado ?? 'activo');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSuccess = (msg: string) => {
        setNombre('');
        setContacto('');
        setTelefono('');
        setEmail('');
        setEstado('activo');
        toast.success(msg);
        onCancel?.();
    };

    const { create, isLoading: isCreating, error: createError } = useCreateProveedor(() =>
        handleSuccess('Proveedor creado exitosamente'),
    );
    const { update, isLoading: isUpdating } = useUpdateProveedor(() =>
        handleSuccess('Proveedor actualizado exitosamente'),
    );
    const isLoading = isCreating || isUpdating;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const payload = { nombre, contacto, telefono, email, estado };
        if (isEditMode && proveedor) {
            setConfirmOpen(true);
        } else {
            create(payload);
        }
    };

    const handleConfirmUpdate = () => {
        if (!proveedor) return;
        setConfirmOpen(false);
        update({
            id: proveedor.id,
            payload: { nombre, contacto, telefono, email, estado },
        });
    };

    const handleReset = () => {
        setNombre('');
        setContacto('');
        setTelefono('');
        setEmail('');
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
                            {isEditMode ? <Edit3 size={18} /> : <Building2 size={18} />}
                            {isEditMode ? 'Editar proveedor' : 'Nuevo proveedor'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditMode
                                ? 'Modifica los datos del proveedor seleccionado.'
                                : 'Registra un nuevo proveedor en el sistema.'}
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
                        placeholder="Razón social del proveedor"
                        required
                        leftIcon={<Building2 size={16} />}
                    />

                    <Input
                        label="Persona de contacto"
                        id="contacto"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Nombre del responsable"
                        required
                        leftIcon={<User size={16} />}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Teléfono"
                            id="telefono"
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="+52 555 000 0000"
                            required
                            leftIcon={<Phone size={16} />}
                        />

                        <Input
                            label="Email"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contacto@proveedor.com"
                            required
                            leftIcon={<Mail size={16} />}
                        />
                    </div>

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
                                ) : (
                                    <Save size={16} />
                                )
                            }
                        >
                            {isLoading
                                ? 'Guardando...'
                                : isEditMode
                                  ? 'Actualizar'
                                  : 'Guardar proveedor'}
                        </Button>
                    </div>
                </form>
            </Card>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                title="¿Editar proveedor?"
                description="Vas a modificar los datos de este proveedor. El cambio se registrará inmediatamente."
                confirmText="Sí, editar"
                cancelText="Cancelar"
                loading={isUpdating}
            />
        </>
    );
};

export default ProveedorForm;
