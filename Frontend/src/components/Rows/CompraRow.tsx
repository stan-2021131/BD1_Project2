import { useState } from "react";
import { api } from "../../services/Api";
import CarritoTable from "../Cart/Cart";
import "./style.css";

const CompraRow = ({ compra, refresh }) => {
    const [detalle, setDetalle] = useState(null);

    const verDetalle = async () => {
        if (detalle) {
            setDetalle(null);
            return;
        }

        const res = await api.get(`compra_venta/compra/${compra.id_transaccion}`);
        setDetalle(res.data);
    };

    const anular = async () => {
        if (!confirm("¿Anular compra?")) return;

        try {
            await api.put(`compra_venta/compra/${compra.id_transaccion}`, {});
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido"
            alert(`Error al anular la compra: ${message}`);
        }
    };

    return (
        <>
            <tr className="row">
                <td>{compra.proveedor}</td>
                <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                <td>{compra.forma_pago}</td>
                <td>{compra.usuario}</td>
                <td>{compra.estado}</td>
                <td className="row-actions">
                    <button onClick={verDetalle} className="row-btn view">{detalle ? "Ocultar" : "Ver"} detalle</button>
                    {compra.estado === "ACTIVO" && <button onClick={anular} className="row-btn delete">Anular</button>}
                </td>
            </tr>

            {detalle && (
                <tr>
                    <td colSpan={6}>
                        <CarritoTable items={detalle.productos} editable={false} dispatch={null} />
                    </td>
                </tr >
            )}
        </>
    );
};

export default CompraRow;