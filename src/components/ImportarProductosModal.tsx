import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useToast } from './ui/useToast';
import { useImportarProductos } from '../hooks/useProducto';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv'] as const;

function getExtension(filename: string): string {
    const idx = filename.lastIndexOf('.');
    if (idx === -1) return '';
    return filename.slice(idx).toLowerCase();
}

function isExtensionAllowed(filename: string): boolean {
    const ext = getExtension(filename);
    return (ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
            errores?: string;
        };
    };
}

function extractErrorMessage(err: unknown, fallback: string): string {
    const apiErr = err as ApiError;
    return (
        apiErr?.response?.data?.errores ??
        apiErr?.response?.data?.message ??
        fallback
    );
}

interface ImportarProductosModalProps {
    open: boolean;
    onClose: () => void;
}

const ImportarProductosModal = ({ open, onClose }: ImportarProductosModalProps) => {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    //Refs para evitar que el callback de la mutación se recree cuando cambien los props.
    const onCloseRef = useRef(onClose);
    const toastRef = useRef(toast);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        toastRef.current = toast;
    }, [toast]);

    const handleExitoImportacion = useCallback(() => {
        toastRef.current.success('Productos importados correctamente.');
        setArchivo(null);
        setValidationError(null);
        const inputEl = fileInputRef.current;
        if (inputEl) inputEl.value = '';
        onCloseRef.current();
    }, []);

    const { importar, isLoading, error, reset: resetMutation } =
        useImportarProductos(handleExitoImportacion);

    const handleClose = () => {
        setArchivo(null);
        setValidationError(null);
        const inputEl = fileInputRef.current;
        if (inputEl) inputEl.value = '';
        resetMutation();
        onClose();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setArchivo(file);
        setValidationError(null);
        resetMutation();

        if (!file) return;

        if (!isExtensionAllowed(file.name)) {
            setValidationError(
                'Formato no soportado. Solo se permiten archivos .xlsx, .xls o .csv.',
            );
            setArchivo(null);
            const inputEl = fileInputRef.current;
            if (inputEl) inputEl.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setValidationError(
                `El archivo supera el tamaño máximo permitido (${formatFileSize(MAX_FILE_SIZE_BYTES)}).`,
            );
            setArchivo(null);
            const inputEl = fileInputRef.current;
            if (inputEl) inputEl.value = '';
        }
    };

    const handleRemoveArchivo = () => {
        setArchivo(null);
        setValidationError(null);
        resetMutation();
        const inputEl = fileInputRef.current;
        if (inputEl) inputEl.value = '';
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!archivo) {
            setValidationError(
                'Selecciona un archivo Excel (.xlsx, .xls) o CSV antes de subir.',
            );
            return;
        }

        importar(archivo);
    };

    const serverError = error
        ? extractErrorMessage(error, 'Ocurrió un error al importar. Inténtalo nuevamente.')
        : null;

    const footer = (
        <>
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancelar
            </Button>
            <Button
                type="submit"
                form="importar-productos-form"
                variant="primary"
                disabled={isLoading || !archivo}
                leftIcon={
                    isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Upload size={16} />
                    )
                }
            >
                {isLoading ? 'Subiendo...' : 'Subir archivo'}
            </Button>
        </>
    );

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Importar productos desde Excel"
            description="Carga un archivo .xlsx, .xls o .csv para registrar productos de forma masiva."
            size="md"
            footer={footer}
        >
            <form id="importar-productos-form" onSubmit={handleSubmit} className="space-y-4">
                <a
                    href="/plantillas/productos.xlsx"
                    download
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    <Download size={16} />
                    Descargar plantilla de ejemplo
                </a>

                <div>
                    <label
                        htmlFor="archivo-input"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        Archivo<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        ref={fileInputRef}
                        id="archivo-input"
                        type="file"
                        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 cursor-pointer"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">
                        Formatos permitidos: .xlsx, .xls, .csv (máx. {formatFileSize(MAX_FILE_SIZE_BYTES)}).
                    </p>
                </div>

                {archivo && !validationError && (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 min-w-0">
                            <FileSpreadsheet size={18} className="text-indigo-600 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {archivo.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(archivo.size)}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveArchivo}
                            disabled={isLoading}
                            aria-label="Quitar archivo seleccionado"
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {validationError && (
                    <div
                        role="alert"
                        className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
                    >
                        {validationError}
                    </div>
                )}

                {serverError && !validationError && (
                    <div
                        role="alert"
                        className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
                    >
                        {serverError}
                    </div>
                )}

                <details className="text-xs text-gray-500 border border-gray-200 rounded-lg p-3">
                    <summary className="cursor-pointer text-gray-700 font-medium">
                        Columnas esperadas
                    </summary>
                    <p className="mt-2">
                        La primera fila debe contener los encabezados:
                    </p>
                    <code className="block mt-1 text-[11px] text-gray-600 break-words">
                        nombre, descripcion, id_categoria, precio_venta, costo, stock_actual,
                        stock_minimo, unidad_medida, estado
                    </code>
                </details>
            </form>
        </Modal>
    );
};

export default ImportarProductosModal;
