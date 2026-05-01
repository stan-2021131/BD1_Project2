import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import ClienteRow from "../../components/Rows/ClienteRow";
import ClienteForm from "../../components/Forms/ClienteForm";
import { useUser } from "../../context/UserContext";

const Clientes = () => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<any>(null);

    const fetchClientes = async () => {
        const res = await api.get("cliente");
        setClientes(res.data);
    };

    const filteredCliente = clientes.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    useEffect(() => {
        fetchClientes();
    }, []);

    return (
        <div style={{ display: "flex", gap: "20px" }}>

            <div style={{ flex: 1 }}>
                <h2>Clientes</h2>

                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1} width="100%">
                    <thead>
                        <tr>
                            <th>NIT</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCliente.map((p) => (
                            <ClienteRow
                                key={p.id_cliente}
                                cliente={p}
                                onSelect={setSelected}
                                refresh={fetchClientes}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FORM SOLO ADMIN */}
            {isAdmin && (
                <div style={{ flex: 1 }}>
                    <ClienteForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchClientes}
                    />
                </div>
            )}
        </div>
    );
};

export default Clientes;