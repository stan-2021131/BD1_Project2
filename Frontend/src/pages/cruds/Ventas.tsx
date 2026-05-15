import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import VentaRow from "../../components/Rows/VentaRow";
import VentaForm from "../../components/Forms/VentaForm";
import useAlert from "../../hooks/useAlert";
import Alert from "../../components/Alert/Alert";
import "./style.css";

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);
    const { success, error, showSuccess, showError, clearAlerts } = useAlert();

    const fetchVentas = async () => {
        let endpoint = "compra_venta/venta";

        if (filtro === "ACTIVO") endpoint += "?activo=true";
        if (filtro === "INACTIVO") endpoint += "?activo=false";

        const res = await api.get(endpoint);
        setVentas(res.data);
    };

    useEffect(() => {
        fetchVentas();
    }, [filtro]);

    return (
        <div>
            <h2>Ventas</h2>
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            {/* FILTROS */}
            <div className="crud-header">
                <div className="crud-filters">
                    <label>
                        <input
                            type="radio"
                            name="filtroVentas"
                            onChange={() => setFiltro("")}
                            checked={filtro === ""}
                        />
                        Todas
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="filtroVentas"
                            onChange={() => setFiltro("ACTIVO")}
                            checked={filtro === "ACTIVO"}
                        />
                        Activas
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="filtroVentas"
                            onChange={() => setFiltro("INACTIVO")}
                            checked={filtro === "INACTIVO"}
                        />
                        Inactivas
                    </label>
                </div>

                <button
                    className="crud-action-btn"
                    onClick={() => setMostrarForm(true)}
                >
                    Hacer venta
                </button>
            </div>

            {mostrarForm &&
                <div className="crud-form-inline">
                    <VentaForm close={() => setMostrarForm(false)} refresh={fetchVentas} onSuccess={showSuccess} onError={showError} onClear={clearAlerts} />
                </div>
            }

            {/* TABLA */}
            <table border={1}>
                <thead>
                    <tr>
                        <th>NIT</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Encargado</th>
                        <th>Forma Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {ventas.map((v) => (
                        <VentaRow key={v.id_transaccion} venta={v} refresh={fetchVentas} onSuccess={showSuccess} onError={showError} onClear={clearAlerts} />
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Ventas;