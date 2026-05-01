import { useEffect, useState, useContext } from "react";
import { api } from "../../services/Api";
import { CarritoComprasContext } from "../../context/CarritoContext";
import CarritoTable from "../Cart/Cart";
import { useUser } from "../../context/UserContext";

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
        <div>
            <h3>Nueva Compra</h3>

            <div>
                <label>Proveedor</label>
                <select onChange={(e) => setProveedor(e.target.value)}>
                    <option>Seleccione</option>
                    {proveedores.map((p) => (
                        <option key={p.id_proveedor} value={p.id_proveedor}>
                            {p.proveedor} - {p.contacto}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Forma de Pago</label>
                <select onChange={(e) => setFormaPago(e.target.value)}>
                    <option>Seleccione</option>
                    {formasPago.map((f) => (
                        <option key={f.id_forma} value={f.id_forma}>
                            {f.forma_pago}
                        </option>
                    ))}
                </select>
            </div>

            {/* CARRITO */}
            <CarritoTable items={state} editable={true} dispatch={dispatch} />

            <button onClick={handleSubmit}>Confirmar compra</button>
            <button onClick={close}>Cancelar</button>
        </div>
    );
};

export default CompraForm;