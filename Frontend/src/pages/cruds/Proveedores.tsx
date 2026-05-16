import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import ProveedorRow from "../../components/Rows/ProveedorRow";
import ProveedorForm from "../../components/Forms/ProveedorForm";
import { useUser } from "../../context/UseUser";
import useAlert from "../../hooks/useAlert";
import Alert from "../../components/Alert/Alert";
import "./style.css";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<any>(null);
    const { success, error, showSuccess, showError, clearAlerts } = useAlert();

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
        <div className="crud-container">
            <div className="crud-table">
                <h2>Proveedores</h2>
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}
                <input
                    className="crud-search"
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1}>
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
                    <ProveedorForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchProveedores}
                        onSuccess={showSuccess}
                        onError={showError}
                        onClear={clearAlerts}
                    />
                </div>
            )}
        </div>
    );
};

export default Proveedores;