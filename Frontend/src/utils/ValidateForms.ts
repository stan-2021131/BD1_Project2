import type { EmpleadoFormValues, EmpleadoFormErrors } from "./FormTypes";


// validar formulario de empleado
export const validateEmpleadoForm = (form: EmpleadoFormValues, selected: any) => {
    const newErrors: EmpleadoFormErrors = {};
    if (!form.usuario) { newErrors.usuario = "El usuario es requerido"; }
    if (!form.contrasena && !selected) { newErrors.contrasena = "La contraseña es requerida"; }
    if (form.id_persona === 0) { newErrors.id_persona = "La persona es requerida"; }
    if (form.id_rol === 0) { newErrors.id_rol = "El rol es requerido"; }

    return newErrors;
};