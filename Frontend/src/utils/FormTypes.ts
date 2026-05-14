// Interfaces para formulario de categorias

export interface CategoriaFormValues {
    categoria: string;
}

export interface CategoriaFormErrors {
    categoria?: string;
}

// Iterfaces para formulario de clientes

export interface ClienteFormValues {
    id_persona: number;
    nit: string;
}

export interface ClienteFormErrors {
    id_persona?: string;
    nit?: string;
}

//Interfaces para formulario de compras

export interface CompraFormValues {
    forma_pago: number;
    proveedor: number;
}

export interface CompraFormErrors {
    forma_pago?: string;
    proveedor?: string;
    productos?: string;
}


//Interfaces para el formulario de empleados

export interface EmpleadoFormValues {
    usuario: string;
    contrasena: string;
    id_persona: number;
    id_rol: number;
}

export interface EmpleadoFormErrors {
    usuario?: string;
    contrasena?: string;
    id_persona?: string;
    id_rol?: string;
}

//Interfaces para el formulario de personas

export interface PersonaFormValues {
    nombre: string;
}

export interface PersonaFormErrors {
    nombre?: string;
}


// Interfaces para el formulario de productos

export interface ProductoFormValues {
    producto: string;
    descripcion: string;
    stock: number;
    precio_compra: number;
    precio_venta: number;
    id_categoria: number;
}

export interface ProductoFormErrors {
    producto?: string;
    descripcion?: string;
    stock?: string;
    precio_compra?: string;
    precio_venta?: string;
    id_categoria?: string;
}


//Interfaces para el formulario de proveedores

export interface ProveedorFormValues {
    proveedor: string;
    direccion: string;
    contacto: string;
}

export interface ProveedorFormErrors {
    proveedor?: string;
    direccion?: string;
    contacto?: string;
}

//Interfaces para el formulario de ventas

export interface VentaFormValues {
    forma_pago: number;
    cliente: number;
}

export interface VentaFormErrors {
    forma_pago?: string;
    cliente?: string;
    productos?: string;
}
