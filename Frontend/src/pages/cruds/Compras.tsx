import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/Api";
import CompraRow from "../../components/Rows/CompraRow";
import CompraForm from "../../components/Forms/CompraForm";
import useAlert from "../../hooks/useAlert";
import Alert from "../../components/Alert/Alert";
import "./style.css";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);

    const { success, error, showSuccess, showError, clearAlerts } = useAlert();

    const fetchCompras = useCallback(async () => {
        let endpoint = "compra_venta/compra";

        if (filtro === "ACTIVO") endpoint += "?activo=true";
        if (filtro === "INACTIVO") endpoint += "?activo=false";

        const res = await api.get(endpoint);
        setCompras(res.data);
    }, [filtro]);

    useEffect(() => {
        fetchCompras();
    }, [fetchCompras]);

    return (
        <div>
            <h2>Compras</h2>
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}
            <div className="crud-header">

                <div className="crud-filters">
                    <label>
                        <input type="radio" name="filtroCompras" onChange={() => setFiltro("")} checked={filtro === ""} />
                        Todas
                    </label>

                    <label>
                        <input type="radio" name="filtroCompras" onChange={() => setFiltro("ACTIVO")} checked={filtro === "ACTIVO"} />
                        Activas
                    </label>

                    <label>
                        <input type="radio" name="filtroCompras" onChange={() => setFiltro("INACTIVO")} checked={filtro === "INACTIVO"} />
                        Inactivas
                    </label>
                </div>

                <button
                    className="crud-action-btn"
                    onClick={() => setMostrarForm(true)}
                >
                    Hacer compra
                </button>
            </div>

            {mostrarForm &&
                <div className="crud-form-inline">
                    <CompraForm close={() => setMostrarForm(false)} refresh={fetchCompras} onSuccess={showSuccess} onError={showError} />
                </div>
            }
            {/* TABLA */}
            <div className="crud-table">
            <table border={1}>
                <thead>
                    <tr>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                        <th>Forma Pago</th>
                        <th>Encargado</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {compras.map((v) => (
                        <CompraRow key={v.id_transaccion} compra={v} refresh={fetchCompras} onSuccess={showSuccess} onError={showError} onClear={clearAlerts} />
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default Compras;