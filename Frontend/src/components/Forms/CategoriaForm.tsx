import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import FormError from "../FormError/FormError";
import type { CategoriaFormValues, CategoriaFormErrors } from "../../utils/FormTypes";
import { validateCategoriaForm } from "../../utils/ValidateForms";
import "./style.css";

const CategoriaForm = ({ selected, clear, refresh, onSuccess, onError, onClear }: { selected: any, clear: () => void, refresh: () => void, onSuccess: (message: string) => void, onError: (message: string) => void, onClear: () => void }) => {

    const initialForm: CategoriaFormValues = {
        categoria: ""
    };

    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState<CategoriaFormErrors>({});

    useEffect(() => {
        if (selected) {
            setForm(selected);
        }
    }, [selected]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [e.target.name]: undefined
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onClear();

        const validateErrors = validateCategoriaForm(form);

        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        setErrors({});

        try {
            if (selected) {
                await api.put(`categoria/${selected.id_categoria}`, form);
                onSuccess("Categoría actualizada");
            } else {
                await api.post("categoria", form);
                onSuccess("Categoría creada");
            }

            clear();
            refresh();
            setForm(initialForm);

        } catch (error: any) {
            console.error(error);
            onError(error.message || "Error");
        }
    };

    return (
        <div className="form-container">
            <h3 className="form-title">{selected ? "Editar" : "Crear"} Categoría</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                        className={`form-input ${errors.categoria ? "form-input-error" : ""}`}
                        name="categoria"
                        value={form.categoria}
                        onChange={handleChange}
                        placeholder="Nombre"
                    />
                    <FormError message={errors.categoria} />
                </div>

                <div className="form-actions">
                    <button className="form-btn" type="submit">
                        {selected ? "Actualizar" : "Crear"}
                    </button>

                    {selected && (
                        <button className="form-btn cancel" type="button" onClick={clear}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CategoriaForm;