import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import EmpleadoRow from "../../components/Rows/EmpleadoRow";
import EmpleadoForm from "../../components/Forms/EmpleadoForm";
import { useUser } from "../../context/UserContext";
import useAlert from "../../hooks/useAlert";
import Alert from "../../components/Alert/Alert";
import "./style.css";

const Empleados = () => {
    const { success, error, showSuccess, showError, clearAlerts } = useAlert();

    const [empleados, setEmpleados] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<any>(null);

    const fetchEmpleados = async () => {
        const res = await api.get("empleado");
        setEmpleados(res.data);
    };

    const filteredEmpleados = empleados.filter((e) =>
        e.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    useEffect(() => {
        fetchEmpleados();
    }, []);

    return (
        <div className="crud-container">
            <div className="crud-table">
                <h2>Empleados</h2>
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}
                <input
                    className="crud-search"
                    type="text"
                    placeholder="Buscar empleado..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1}>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredEmpleados.map((e) => (
                            <EmpleadoRow
                                key={e.id_empleado}
                                empleado={e}
                                onSelect={setSelected}
                                refresh={fetchEmpleados}
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
                    <EmpleadoForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchEmpleados}
                        onSuccess={showSuccess}
                        onError={showError}
                        onClear={clearAlerts}
                    />
                </div>
            )}
        </div>
    );
};

export default Empleados;