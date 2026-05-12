export interface Proveedor {
    id: number;
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

export interface ProveedorPayload {
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    estado: string;
}

export interface ProveedorResponse {
    id: number;
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    estado: string;
    created_at: string;
    updated_at: string;
}