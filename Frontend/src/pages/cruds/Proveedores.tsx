import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import ProveedorRow from "../../components/Rows/ProveedorRow";
import ProveedorForm from "../../components/Forms/ProveedorForm";
import { useUser } from "../../context/UserContext";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<any>(null);

    const fetchProveedores = async () => {
        const res = await api.get("proveedor");
        setProveedores(res.data);
    };

    const filteredProveedores = proveedores.filter((p) =>
        p.proveedor.toLowerCase().includes(search.toLowerCase())
    );

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    useEffect(() => {
        fetchProveedores();
    }, []);

    return (
        <div style={{ display: "flex", gap: "20px" }}>

            <div style={{ flex: 1 }}>
                <h2>Proveedores</h2>

                <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1} width="100%">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Contacto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProveedores.map((p) => (
                            <ProveedorRow
                                key={p.id_proveedor}
                                proveedor={p}
                                onSelect={setSelected}
                                refresh={fetchProveedores}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdmin && (
                <div style={{ flex: 1 }}>
                    <ProveedorForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchProveedores}
                    />
                </div>
            )}
        </div>
    );
};

export default Proveedores;