import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import PersonaRow from "../../components/Rows/PersonaRow";
import PersonaForm from "../../components/Forms/PersonaForm";
import { useUser } from "../../context/UserContext";

const Personas = () => {
    const [personas, setPersonas] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<any>(null);

    const fetchPersonas = async () => {
        const res = await api.get("persona");
        setPersonas(res.data);
    };

    const filtered = personas.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    useEffect(() => {
        fetchPersonas();
    }, []);

    return (
        <div style={{ display: "flex", gap: "20px" }}>

            <div style={{ flex: 1 }}>
                <h2>Personas</h2>

                <input
                    type="text"
                    placeholder="Buscar persona..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1} width="100%">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((p) => (
                            <PersonaRow
                                key={p.id_persona}
                                persona={p}
                                onSelect={setSelected}
                                refresh={fetchPersonas}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdmin && (
                <div style={{ flex: 1 }}>
                    <PersonaForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchPersonas}
                    />
                </div>
            )}
        </div>
    );
};

export default Personas;