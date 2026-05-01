import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import CategoriaRow from "../../components/Rows/CategoriaRow";
import CategoriaForm from "../../components/Forms/CategoriaForm";
import { useUser } from "../../context/UserContext";

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
        <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
                <h2>Categorías</h2>

                <input
                    placeholder="Buscar categoría..."
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
                <div style={{ flex: 1 }}>
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