export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

export interface CategoriaPayload {
    nombre: string;
    descripcion: string;
    estado: string;
}

export interface CategoriaResponse {
    nombre: string;
    descripcion: string;
    estado: string;
    updated_at: string;
    created_at: string;
    id: number;
}