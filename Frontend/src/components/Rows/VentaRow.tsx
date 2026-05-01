import { useState } from "react";
import { api } from "../../services/Api";
import CarritoTable from "../Cart/Cart";

const VentaRow = ({ venta, refresh }) => {
    const [detalle, setDetalle] = useState(null);

    const verDetalle = async () => {
        if (detalle) {
            setDetalle(null);
            return;
        }

        const res = await api.get(`compra_venta/venta/${venta.id_transaccion}`);
        setDetalle(res.data);
    };

    const anular = async () => {
        if (!confirm("¿Anular venta?")) return;

        try {
            await api.put(`compra_venta/venta/${venta.id_transaccion}`, {});
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido"
            alert(`Error al anular la venta: ${message}`);
        }
    };

    return (
        <>
            <tr>
                <td>{venta.nit}</td>
                <td>{venta.nombre}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>{venta.usuario}</td>
                <td>{venta.forma_pago}</td>
                <td>{venta.estado}</td>
                <td>
                    <button onClick={verDetalle}>{detalle ? "Ocultar" : "Ver"} detalle</button>
                    {venta.estado === "ACTIVO" && <button onClick={anular}>Anular</button>}
                </td>
            </tr>

            {detalle && (
                <tr>
                    <td colSpan={6}>
                        <CarritoTable items={detalle.productos} editable={false} dispatch={null} />
                    </td>
                </tr>
            )}
        </>
    );
};

export default VentaRow;