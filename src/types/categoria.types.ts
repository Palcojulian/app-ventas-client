export interface Categoria {
    id: number;
    nombre: string;
    prefijo: string;
    descripcion: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

export interface CategoriaPayload {
    nombre: string;
    prefijo: string;
    descripcion: string;
    estado: string;
}

export interface CategoriaResponse {
    id: number;
    nombre: string;
    prefijo: string;
    descripcion: string;
    estado: string;
    created_at: string;
    updated_at: string;
}