import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import "./style.css";

const EmpleadoForm = ({ selected, clear, refresh }) => {

    const initialForm = {
        usuario: "",
        contrasena: "",
        id_persona: 0,
        id_rol: 0
    };

    const [form, setForm] = useState(initialForm);

    const [personas, setPersonas] = useState([]);
    const [roles, setRoles] = useState([]);

    //cargar personas y roles
    useEffect(() => {
        const fetchData = async () => {
            const p = await api.get("persona");
            const r = await api.get("rol");

            setPersonas(p.data);
            setRoles(r.data);
        };

        fetchData();
    }, []);

    // cargar empleado seleccionado
    useEffect(() => {
        if (selected) {
            setForm({
                ...selected,
                id_persona: Number(selected.id_persona || 0),
                id_rol: Number(selected.id_rol || 0),
                contrasena: ""
            });
        }
    }, [selected]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "id_persona" || name === "id_rol"
                ? Number(value)
                : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selected) {
                await api.put(`empleado/${selected.id_empleado}`, form);
                alert("Empleado actualizado");
            } else {
                await api.post("empleado", form);
                alert("Empleado creado");
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
            <h3 className="form-title">{selected ? "Editar" : "Crear"} Empleado</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Usuario</label>
                    <input className="form-input" name="usuario" value={form.usuario} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input className="form-input" type="password" name="contrasena" value={form.contrasena} onChange={handleChange} placeholder={selected ? "Dejar en blanco para no cambiar" : "Contraseña"} />
                </div>

                <div className="form-group">
                    <label className="form-label">Persona</label>
                    <select className="form-select"
                        name="id_persona"
                        value={form.id_persona}
                        onChange={handleChange}
                        disabled={selected ? true : false}
                    >
                        <option value={0} disabled>Seleccione una persona</option>
                        {personas.map((p) => (
                            <option key={p.id_persona} value={p.id_persona}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Rol</label>
                    <select className="form-select" name="id_rol" value={form.id_rol} onChange={handleChange}>
                        <option value={0} disabled>Seleccione un rol</option>
                        {roles.map((r) => (
                            <option key={r.id_rol} value={r.id_rol}>
                                {r.rol}
                            </option>
                        ))}
                    </select>
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

export default EmpleadoForm;