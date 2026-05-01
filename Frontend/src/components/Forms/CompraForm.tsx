import { useEffect, useState, useContext } from "react";
import { api } from "../../services/Api";
import { CarritoComprasContext } from "../../context/CarritoContext";
import CarritoTable from "../Cart/Cart";
import { useUser } from "../../context/UserContext";
import "./style.css";

const CompraForm = ({ close, refresh }) => {
    const { state, dispatch } = useContext(CarritoComprasContext);
    const { user } = useUser();

    const [proveedores, setProveedores] = useState([]);
    const [formasPago, setFormasPago] = useState([]);

    const [proveedor, setProveedor] = useState("");
    const [formaPago, setFormaPago] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const p = await api.get("proveedor");
            const f = await api.get("forma_pago");

            setProveedores(p.data);
            setFormasPago(f.data);
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!proveedor) {
            alert("Debe seleccionar un proveedor");
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
            await api.post("compra_venta/compra", {
                encargado: user.id_empleado,
                forma_pago: Number(formaPago),
                proveedor: Number(proveedor),
                productos: state.map((p) => ({
                    id_producto: p.id_producto,
                    cantidad: p.cantidad,
                })),
            });

            alert(`Compra realizada exitosamente`);
            dispatch({ type: "LIMPIAR" });
            refresh();
            close();
        } catch (error) {
            console.error(error);
            alert(`Error al realizar la compra: ${error.message}`);
        }
    };

    return (
        <div className="form-container">
            <h3 className="form-title">Nueva Compra</h3>

            <div className="form-split">
                <div className="form-left">
                    <div className="form-group">
                        <label className="form-label">Proveedor</label>
                        <select className="form-select" onChange={(e) => setProveedor(e.target.value)}>
                            <option>Seleccione</option>
                            {proveedores.map((p) => (
                                <option key={p.id_proveedor} value={p.id_proveedor}>
                                    {p.proveedor} - {p.contacto}
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

                {/* CARRITO */}
                <div className="form-right">
                    <CarritoTable items={state} editable={true} dispatch={dispatch} />
                </div>
            </div>
            <div className="form-actions">
                <button className="form-btn" onClick={handleSubmit}>Confirmar compra</button>
                <button className="form-btn cancel" onClick={close}>Cancelar</button>
            </div>
        </div>
    );
};

export default CompraForm;