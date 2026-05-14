import type {
    EmpleadoFormValues,
    EmpleadoFormErrors,
    ProductoFormValues,
    ProductoFormErrors,
    CategoriaFormValues,
    CategoriaFormErrors,
    ClienteFormValues,
    ClienteFormErrors,
    CompraFormValues,
    CompraFormErrors,
    PersonaFormValues,
    PersonaFormErrors,
    ProveedorFormValues,
    ProveedorFormErrors,
    VentaFormValues,
    VentaFormErrors
} from "./FormTypes";

// validar formulario de categoria
export const validateCategoriaForm = (form: CategoriaFormValues) => {
    const newErrors: CategoriaFormErrors = {};
    if (!form.categoria) { newErrors.categoria = "La categoría es requerida"; }
    return newErrors;
};

// validar formulario de cliente
export const validateClienteForm = (form: ClienteFormValues) => {
    const newErrors: ClienteFormErrors = {};
    if (!form.nit) { newErrors.nit = "El NIT es requerido"; }
    if (form.nit.length < 8 || form.nit.length > 14) { newErrors.nit = "El NIT debe tener entre 8 y 14 caracteres"; }
    if (form.id_persona === 0) { newErrors.id_persona = "La persona es requerida"; }
    return newErrors;
};

// validar formulario de compra
export const validateCompraForm = (form: CompraFormValues, productos: any[]) => {
    const newErrors: CompraFormErrors = {};
    if (form.forma_pago === 0) { newErrors.forma_pago = "La forma de pago es requerida"; }
    if (form.proveedor === 0) { newErrors.proveedor = "El proveedor es requerido"; }
    if (productos.length === 0) { newErrors.productos = "Debe agregar productos"; }
    return newErrors;
};

// validar formulario de empleado
export const validateEmpleadoForm = (form: EmpleadoFormValues, selected: any) => {
    const newErrors: EmpleadoFormErrors = {};
    if (!form.usuario) { newErrors.usuario = "El usuario es requerido"; }
    if (!form.contrasena && !selected) { newErrors.contrasena = "La contraseña es requerida"; }
    if (form.id_persona === 0) { newErrors.id_persona = "La persona es requerida"; }
    if (form.id_rol === 0) { newErrors.id_rol = "El rol es requerido"; }

    return newErrors;
};

//validar formulario de personas
export const validatePersonaForm = (form: PersonaFormValues) => {
    const newErrors: PersonaFormErrors = {};
    if (!form.nombre || form.nombre.trim() === "") { newErrors.nombre = "El nombre es requerido"; }
    if (form.nombre.length < 3) { newErrors.nombre = "El nombre debe tener al menos 3 caracteres"; }

    return newErrors;
};

// validar formulario de producto
export const validateProductoForm = (form: ProductoFormValues) => {
    const newErrors: ProductoFormErrors = {};
    if (!form.producto) { newErrors.producto = "El producto es requerido"; }
    if (!form.descripcion) { newErrors.descripcion = "La descripción es requerida"; }
    if (form.stock < 0) { newErrors.stock = "El stock no puede ser negativo"; }
    if (form.precio_compra <= 0) { newErrors.precio_compra = "El precio de compra debe ser mayor a 0"; }
    if (form.precio_venta <= 0) { newErrors.precio_venta = "El precio de venta debe ser mayor a 0"; }
    if (form.id_categoria === 0) { newErrors.id_categoria = "La categoría es requerida"; }

    return newErrors;
};

// validar formulario de proveedor
export const validateProveedorForm = (form: ProveedorFormValues) => {
    const newErrors: ProveedorFormErrors = {};
    if (!form.proveedor) { newErrors.proveedor = "El proveedor es requerido"; }
    if (!form.direccion) { newErrors.direccion = "La dirección es requerida"; }
    if (!form.contacto) { newErrors.contacto = "El contacto es requerido"; }
    if (form.contacto.length < 8 || form.contacto.length > 14) { newErrors.contacto = "El contacto debe tener entre 8 y 14 caracteres"; }
    if (form.contacto.length < 8 || form.contacto.length > 14) { newErrors.contacto = "El contacto debe tener entre 8 y 14 caracteres"; }

    return newErrors;
};

// validar formulario de venta
export const validateVentaForm = (form: VentaFormValues, productos: any[]) => {
    const newErrors: VentaFormErrors = {};
    if (form.forma_pago === 0) { newErrors.forma_pago = "La forma de pago es requerida"; }
    if (form.cliente === 0) { newErrors.cliente = "El cliente es requerido"; }
    if (productos.length === 0) { newErrors.productos = "Debe agregar productos"; }
    return newErrors;
};
