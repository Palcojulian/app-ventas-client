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

export interface DetalleVenta {
    id: number;
    id_venta: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    total: number;
    created_at: string;
    updated_at: string;
    producto?: Producto;
}

export interface Venta {
    id: number;
    numero_factura: string;
    id_cliente: number;
    id_usuario: number;
    subtotal: number;
    impuestos: number;
    descuento: number;
    total: number;
    metodo_pago: string;
    estado: string;
    created_at: string;
    updated_at: string;
    cliente: string;
    usuario_sistema: string;
    detalles?: DetalleVenta[];
}

export interface VentaResponse {
    id: number;
    numero_factura: string;
    id_cliente: number;
    id_usuario: number;
    subtotal: number;
    impuestos: number;
    descuento: number;
    total: number;
    metodo_pago: string;
    estado: string;
    created_at: string;
    updated_at: string;
    cliente: string;
    usuario_sistema: string;
    detalles?: DetalleVenta[];
}

export interface VentaPayload {
    id_cliente: number;
    impuestos: number;
    descuento: number;
    metodo_pago: string;
    estado: string;
    detalles: DetalleVentaPayload[];
}

export interface DetalleVentaPayload {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
}

export const METODOS_PAGO = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'otro', label: 'Otro' },
];

export const ESTADOS_VENTA = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' },
];
