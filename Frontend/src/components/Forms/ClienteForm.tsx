import { useEffect, useState } from "react";
import { api } from "../../services/Api";

const ClienteForm = ({ selected, clear, refresh }) => {
    const initialForm = {
        nit: "",
        id_persona: 0
    };
    const [form, setForm] = useState(initialForm);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        <div>
            <h3>{selected ? "Editar" : "Crear"} Cliente</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>NIT</label>
                    <input name="nit" placeholder="NIT" value={form.nit} onChange={handleChange} />
                </div>
                <div>
                    <label>Persona</label>
                    <select name="id_persona" value={form.id_persona} onChange={handleChange} disabled={selected ? true : false}>
                        <option value={0} disabled>Seleccione una persona</option>
                        {personas.map((per) => (
                            <option key={per.id_persona} value={per.id_persona}>
                                {per.nombre}
                            </option>
                        ))}
                    </select>
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

export default ClienteForm;