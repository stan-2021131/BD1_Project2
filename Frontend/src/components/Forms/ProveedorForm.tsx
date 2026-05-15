import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import type { ProveedorFormValues, ProveedorFormErrors } from "../../utils/FormTypes";
import { validateProveedorForm } from "../../utils/ValidateForms";
import FormError from "../FormError/FormError";
import "./style.css";

const ProveedorForm = ({ selected, clear, refresh, onSuccess, onError, onClear }: any) => {
    const initialForm: ProveedorFormValues = {
        proveedor: "",
        direccion: "",
        contacto: ""
    };

    const [form, setForm] = useState<ProveedorFormValues>(initialForm);
    const [errors, setErrors] = useState<ProveedorFormErrors>({});

    useEffect(() => {
        if (selected) {
            setForm(selected);
        }
    }, [selected]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onClear();

        const validateErrors = validateProveedorForm(form);
        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        setErrors({});

        if (selected) {
            try {
                await api.put(`proveedor/${selected.id_proveedor}`, form);
                onSuccess("Proveedor actualizado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido";
                onError(`Error al actualizar proveedor: ${message}`);
            }
        } else {
            try {
                await api.post("proveedor", form);
                onSuccess("Proveedor creado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido";
                onError(`Error al crear proveedor: ${message}`);
            }
        }

        clear();
        refresh();
        setForm(initialForm);
    };

    return (
        <div className="form-container">
            <h3 className="form-title">{selected ? "Editar" : "Crear"} Proveedor</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" name="proveedor" value={form.proveedor} onChange={handleChange} />
                    <FormError message={errors.proveedor} />
                </div>

                <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input className="form-input" name="direccion" value={form.direccion} onChange={handleChange} />
                    <FormError message={errors.direccion} />
                </div>

                <div className="form-group">
                    <label className="form-label">Contacto</label>
                    <input className="form-input" name="contacto" value={form.contacto} onChange={handleChange} />
                    <FormError message={errors.contacto} />
                </div>

                <div className="form-actions">
                    <button className="form-btn" type="submit">
                        {selected ? "Actualizar" : "Crear"}
                    </button>

                    {selected && (
                        <button className="form-btn cancel" type="button" onClick={() => { clear(); setForm(initialForm); }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProveedorForm;