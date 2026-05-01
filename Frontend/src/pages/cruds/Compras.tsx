import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import CompraRow from "../../components/Rows/CompraRow";
import CompraForm from "../../components/Forms/CompraForm";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);

    const fetchCompras = async () => {
        let endpoint = "compra_venta/compra";

        if (filtro === "ACTIVO") endpoint += "?activo=true";
        if (filtro === "INACTIVO") endpoint += "?activo=false";

        const res = await api.get(endpoint);
        setCompras(res.data);
    };

    useEffect(() => {
        fetchCompras();
    }, [filtro]);

    return (
        <div>
            <h2>Compras</h2>

            {/* FILTROS */}
            <div>
                <label>
                    <input
                        type="radio"
                        name="filtroCompras"
                        onChange={() => setFiltro("")}
                        checked={filtro === ""}
                    />
                    Todas
                </label>

                <label>
                    <input
                        type="radio"
                        name="filtroCompras"
                        onChange={() => setFiltro("ACTIVO")}
                        checked={filtro === "ACTIVO"}
                    />
                    Activas
                </label>

                <label>
                    <input
                        type="radio"
                        name="filtroCompras"
                        onChange={() => setFiltro("INACTIVO")}
                        checked={filtro === "INACTIVO"}
                    />
                    Inactivas
                </label>
            </div>

            <button onClick={() => setMostrarForm(true)}>Hacer compra</button>

            {/* TABLA */}
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
                        <CompraRow key={v.id_transaccion} compra={v} refresh={fetchCompras} />
                    ))}
                </tbody>
            </table>

            {mostrarForm && <CompraForm close={() => setMostrarForm(false)} refresh={fetchCompras} />}
        </div>
    );
};

export default Compras;