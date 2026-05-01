import { useEffect, useState } from "react";
import { api } from "../../services/Api";

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
        <div>
            <h3>{selected ? "Editar" : "Crear"} Proveedor</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input name="proveedor" value={form.proveedor} onChange={handleChange} />
                </div>

                <div>
                    <label>Dirección</label>
                    <input name="direccion" value={form.direccion} onChange={handleChange} />
                </div>

                <div>
                    <label>Contacto</label>
                    <input name="contacto" value={form.contacto} onChange={handleChange} />
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

export default ProveedorForm;