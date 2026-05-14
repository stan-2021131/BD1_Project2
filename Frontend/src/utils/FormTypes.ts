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