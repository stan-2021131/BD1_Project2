import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import FormError from "../FormError/FormError";
import type { ClienteFormValues, ClienteFormErrors } from "../../utils/FormTypes";
import { validateClienteForm } from "../../utils/ValidateForms";
import "./style.css";

const ClienteForm = ({ selected, clear, refresh }: { selected: any, clear: () => void, refresh: () => void }) => {
    const initialForm: ClienteFormValues = {
        nit: "",
        id_persona: 0
    };
    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState<ClienteFormErrors>({});

    const [personas, setPersonas] = useState([]);

    // cargar personas
    useEffect(() => {
        const fetchPersonas = async () => {
            const res = await api.get("persona");
            setPersonas(res.data);
        };
        fetchPersonas();
    }, []);

    // cargar cliente seleccionado
    useEffect(() => {
        if (selected) {
            setForm({
                ...selected,
                id_persona: Number(selected.id_persona)
            });
        }
    }, [selected]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "id_persona" ? Number(value) : value
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validateErrors = validateClienteForm(form);

        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        setErrors({});

        if (selected) {
            try {
                await api.put(`cliente/${selected.id_cliente}`, form);
                alert("Cliente actualizado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido"
                alert(`Error al actualizar el cliente: ${message}`);
            }
        } else {
            try {
                await api.post("cliente", form);
                alert("Cliente creado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido"
                alert(`Error al crear el cliente: ${message}`);
            }
        }

        clear();
        refresh();
        setForm(initialForm);
    };

    return (
        <div className="form-container">
            <h3 className="form-title">{selected ? "Editar" : "Crear"} Cliente</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">NIT</label>
                    <input className={`form-input ${errors.nit ? "form-input-error" : ""}`} name="nit" placeholder="NIT" value={form.nit} onChange={handleChange} />
                    <FormError message={errors.nit} />
                </div>
                <div className="form-group">
                    <label className="form-label">Persona</label>
                    <select className={`form-select ${errors.id_persona ? "form-input-error" : ""}`} name="id_persona" value={form.id_persona} onChange={handleChange} disabled={selected ? true : false}>
                        <option value={0} disabled>Seleccione una persona</option>
                        {personas.map((per) => (
                            <option key={per.id_persona} value={per.id_persona}>
                                {per.nombre}
                            </option>
                        ))}
                    </select>
                    <FormError message={errors.id_persona} />
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

export default ClienteForm;