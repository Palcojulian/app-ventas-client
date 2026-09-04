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
}

export interface DetalleCompra {
    id: number;
    id_compra: number;
    id_producto: number;
    cantidad: number;
    costo_unitario: number;
    total: number;
    created_at: string;
    updated_at: string;
    producto?: Producto;
}

export interface Compra {
    id: number;
    id_proveedor: number;
    total: number;
    estado: string;
    created_at: string;
    updated_at: string;
    proveedor?: string;
    contacto?: string;
    telefono?: string;
    correo?: string;
}

export interface CompraResponse {
    id: number;
    id_proveedor: number;
    total: number;
    estado: string;
    created_at: string;
    updated_at: string;
    proveedor?: Proveedor;
    detalle_compras?: DetalleCompra[];
}

export interface CompraPayload {
    id_proveedor: number;
    estado: string;
    detalles: DetalleCompraPayload[];
}

export interface DetalleCompraPayload {
    id_producto: number;
    cantidad: number;
    costo_unitario: number;
}