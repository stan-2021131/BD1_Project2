import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import "./style.css";

const PersonaForm = ({ selected, clear, refresh }) => {

    const initialForm = {
        nombre: ""
    };

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (selected) {
            setForm(selected);
        }
    }, [selected]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selected) {
                await api.put(`persona/${selected.id_persona}`, form);
                alert("Persona actualizada");
            } else {
                await api.post("persona", form);
                alert("Persona creada");
            }

            clear();
            refresh();
            setForm(initialForm);

        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido";
            alert(`Error: ${message}`);
        }
    };

    return (
        <div className="form-container">
            <h3 className="form-title">{selected ? "Editar" : "Crear"} Persona</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" name="nombre" value={form.nombre} onChange={handleChange} />
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

export default PersonaForm;