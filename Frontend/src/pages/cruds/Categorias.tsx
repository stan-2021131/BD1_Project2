import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import CategoriaRow from "../../components/Rows/CategoriaRow";
import CategoriaForm from "../../components/Forms/CategoriaForm";
import { useUser } from "../../context/UserContext";
import useAlert from "../../hooks/useAlert";
import Alert from "../../components/Alert/Alert";
import "./style.css";

const Categorias = () => {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<any>(null);
    const { success, error, showSuccess, showError, clearAlerts } = useAlert();

    const fetchCategorias = async () => {
        const res = await api.get("categoria");
        setCategorias(res.data);
    };

    const filtered = categorias.filter((c) =>
        c.categoria.toLowerCase().includes(search.toLowerCase())
    );

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <div className="crud-container">
            <div className="crud-table">
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}
                <h2>Categorías</h2>
                <input
                    className="crud-search"
                    placeholder="Buscar categoría..."
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
                        {filtered.map((c) => (
                            <CategoriaRow
                                key={c.id_categoria}
                                categoria={c}
                                onSelect={setSelected}
                                refresh={fetchCategorias}
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
                    <CategoriaForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchCategorias}
                        onSuccess={showSuccess}
                        onError={showError}
                        onClear={clearAlerts}
                    />
                </div>
            )}
        </div>
    );
};

export default Categorias;