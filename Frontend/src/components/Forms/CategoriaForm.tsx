import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import "./style.css";

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
        <div className="form-container">
            <h3 className="form-title">{selected ? "Editar" : "Crear"} Categoría</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                        className="form-input"
                        value={form.categoria}
                        onChange={handleChange}
                        placeholder="Nombre"
                    />
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