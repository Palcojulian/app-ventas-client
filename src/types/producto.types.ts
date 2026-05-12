export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    id_categoria: number;
    precio_venta: number;
    costo: number;
    stock_actual: number;
    stock_minimo: number;
    unidad_medida: string;
    estado: string;
    created_at: string;
    updated_at: string;
    categoria?: string;
}

export interface ProductoPayload {
    codigo?: string;
    nombre: string;
    descripcion: string;
    id_categoria: number;
    precio_venta: number;
    costo: number;
    stock_actual: number;
    stock_minimo: number;
    unidad_medida?: string;
    estado: string;
}

export interface ProductoResponse {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    id_categoria: number;
    precio_venta: number;
    costo: number;
    stock_actual: number;
    stock_minimo: number;
    unidad_medida: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

export const UNIDADES_MEDIDA = [
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'l', label: 'Litros (L)' },
    { value: 'g', label: 'Gramos (g)' },
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'u', label: 'Unidades (u)' },
];