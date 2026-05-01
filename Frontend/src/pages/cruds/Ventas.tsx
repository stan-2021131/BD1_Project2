import { useEffect, useState } from "react";
import { api } from "../../services/Api";
import VentaRow from "../../components/Rows/VentaRow";
import VentaForm from "../../components/Forms/VentaForm";

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [mostrarForm, setMostrarForm] = useState(false);

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

            {/* FILTROS */}
            <div>
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

            <button onClick={() => setMostrarForm(true)}>Hacer venta</button>

            {/* TABLA */}
            <table border={1}>
                <thead>
                    <tr>
                        <th>NIT</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Forma Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {ventas.map((v) => (
                        <VentaRow key={v.id_transaccion} venta={v} refresh={fetchVentas} />
                    ))}
                </tbody>
            </table>

            {mostrarForm && <VentaForm close={() => setMostrarForm(false)} refresh={fetchVentas} />}
        </div>
    );
};

export default Ventas;