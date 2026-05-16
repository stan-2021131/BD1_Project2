import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import PersonaRow from "../../components/Rows/PersonaRow";
import PersonaForm from "../../components/Forms/PersonaForm";
import { useUser } from "../../context/UseUser";
import useAlert from "../../hooks/useAlert";
import Alert from "../../components/Alert/Alert";
import "./style.css";

const Personas = () => {
    const [personas, setPersonas] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<any>(null);
    const { success, error, showSuccess, showError, clearAlerts } = useAlert();

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
        <div className="crud-container">

            <div className="crud-table">
                <h2>Personas</h2>
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <input
                    className="crud-search"
                    type="text"
                    placeholder="Buscar persona..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1}>
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
                                onSuccess={showSuccess}
                                onError={showError}
                                onClear={clearAlerts}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdmin && (
                <div className="crud-form">
                    <PersonaForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchPersonas}
                        onSuccess={showSuccess}
                        onError={showError}
                        onClear={clearAlerts}
                    />
                </div>
            )}
        </div>
    );
};

export default Personas;