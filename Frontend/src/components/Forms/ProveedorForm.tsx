import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import "./style.css";

const ProveedorForm = ({ selected, clear, refresh }) => {
    const initialForm = {
        proveedor: "",
        direccion: "",
        contacto: ""
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

        if (selected) {
            try {
                await api.put(`proveedor/${selected.id_proveedor}`, form);
                alert("Proveedor actualizado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido";
                alert(`Error al actualizar proveedor: ${message}`);
            }
        } else {
            try {
                await api.post("proveedor", form);
                alert("Proveedor creado");
            } catch (error: any) {
                console.error(error);
                const message = error.message || "Error desconocido";
                alert(`Error al crear proveedor: ${message}`);
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
                </div>

                <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input className="form-input" name="direccion" value={form.direccion} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Contacto</label>
                    <input className="form-input" name="contacto" value={form.contacto} onChange={handleChange} />
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

export default ProveedorForm;