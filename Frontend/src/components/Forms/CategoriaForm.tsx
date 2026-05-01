import { useEffect, useState } from "react";
import { api } from "../../services/Api";

const CategoriaForm = ({ selected, clear, refresh }) => {

    const initialForm = {
        categoria: ""
    };

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (selected) {
            setForm(selected);
        }
    }, [selected]);

    const handleChange = (e) => {
        setForm({ ...form, categoria: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selected) {
                await api.put(`categoria/${selected.id_categoria}`, form);
                alert("Categoría actualizada");
            } else {
                await api.post("categoria", form);
                alert("Categoría creada");
            }

            clear();
            refresh();
            setForm(initialForm);

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error");
        }
    };

    return (
        <div>
            <h3>{selected ? "Editar" : "Crear"} Categoría</h3>

            <form onSubmit={handleSubmit}>
                <input
                    value={form.categoria}
                    onChange={handleChange}
                    placeholder="Nombre"
                />

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

export default CategoriaForm;