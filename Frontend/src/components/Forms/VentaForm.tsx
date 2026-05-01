import { useEffect, useState, useContext } from "react";
import { api } from "../../services/Api";
import { CarritoVentasContext } from "../../context/CarritoContext";
import CarritoTable from "../Cart/Cart";
import { useUser } from "../../context/UserContext";
import "./style.css";

const VentaForm = ({ close, refresh }) => {
    const { state, dispatch } = useContext(CarritoVentasContext);
    const { user } = useUser();

    const [clientes, setClientes] = useState([]);
    const [formasPago, setFormasPago] = useState([]);

    const [cliente, setCliente] = useState("");
    const [formaPago, setFormaPago] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const c = await api.get("cliente");
            const f = await api.get("forma_pago");

            setClientes(c.data);
            setFormasPago(f.data);
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!cliente) {
            alert("Debe seleccionar un cliente");
            return;
        }

        if (!formaPago) {
            alert("Debe seleccionar una forma de pago");
            return;
        }

        if (state.length === 0) {
            alert("Debe agregar productos");
            return;
        }

        try {
            await api.post("compra_venta/venta", {
                encargado: user.id_empleado,
                forma_pago: Number(formaPago),
                cliente: Number(cliente),
                productos: state.map((p) => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                })),
            });

            alert(`Venta realizada exitosamente`);
            dispatch({ type: "LIMPIAR" });
            refresh();
            close();
        } catch (error) {
            console.error(error);
            alert(`Error al realizar la venta: ${error.message}`);
        }
    };

    return (
        <div className="form-container">
            <h3 className="form-title">Nueva Venta</h3>

            <div className="form-split">

                {/* IZQUIERDA */}
                <div className="form-left">
                    <div className="form-group">
                        <label className="form-label">Cliente</label>
                        <select className="form-select" onChange={(e) => setCliente(e.target.value)}>
                            <option>Seleccione</option>
                            {clientes.map((c) => (
                                <option key={c.id_cliente} value={c.id_cliente}>
                                    {c.nombre} - {c.nit}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Forma de Pago</label>
                        <select className="form-select" onChange={(e) => setFormaPago(e.target.value)}>
                            <option>Seleccione</option>
                            {formasPago.map((f) => (
                                <option key={f.id_forma} value={f.id_forma}>
                                    {f.forma_pago}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* DERECHA */}
                <div className="form-right">
                    <CarritoTable items={state} editable={true} dispatch={dispatch} />
                </div>

            </div>

            <div className="form-actions">
                <button className="form-btn" onClick={handleSubmit}>Confirmar venta</button>
                <button className="form-btn cancel" onClick={close}>Cancelar</button>
            </div>
        </div>
    );
};

export default VentaForm;