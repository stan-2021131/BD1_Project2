import { useEffect, useState } from "react";
import { api } from "../../services/Api";

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
        <div>
            <h3>{selected ? "Editar" : "Crear"} Persona</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    {selected ? "Actualizar" : "Crear"}
                </button>

                {selected && (
                    <button type="button" onClick={clear}>
                        Cancelar
                    </button>
                )}
            </form>
        </div>
    );
};

export default PersonaForm;