import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import CategoriaRow from "../../components/Rows/CategoriaRow";
import CategoriaForm from "../../components/Forms/CategoriaForm";
import { useUser } from "../../context/UserContext";
import "./style.css";

const Categorias = () => {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<any>(null);

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
                    />
                </div>
            )}
        </div>
    );
};

export default Categorias;