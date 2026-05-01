import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import EmpleadoRow from "../../components/Rows/EmpleadoRow";
import EmpleadoForm from "../../components/Forms/EmpleadoForm";
import { useUser } from "../../context/UserContext";

const Empleados = () => {
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
        <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
                <h2>Empleados</h2>

                <input
                    type="text"
                    placeholder="Buscar empleado..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table border={1} width="100%">
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
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdmin && (
                <div style={{ flex: 1 }}>
                    <EmpleadoForm
                        selected={selected}
                        clear={() => setSelected(null)}
                        refresh={fetchEmpleados}
                    />
                </div>
            )}
        </div>
    );
};

export default Empleados;