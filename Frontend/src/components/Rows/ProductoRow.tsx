import { api } from "../../services/Api";
import { useContext, useState } from "react";
import { useUser } from "../../context/UserContext";
import { CarritoComprasContext, CarritoVentasContext } from "../../context/CarritoContext";
import "./style.css";

const ProductoRow = ({ producto, onSelect, refresh, onSuccess, onError, onClear }: any) => {
    const [cantidad, setCantidad] = useState(1);

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    // Consumo de carritos
    const { dispatch: dispatchVentas } = useContext(CarritoVentasContext);
    const { dispatch: dispatchCompras } = useContext(CarritoComprasContext);

    const handleDelete = async () => {
        if (!confirm("¿Eliminar producto?")) return;
        onClear();

        try {
            await api.delete(`producto/${producto.id_producto}`);
            onSuccess("Producto eliminado");
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido"
            onError(`Error al eliminar el producto: ${message}`);
        }
    };

    const handleAddVenta = () => {
        if (cantidad <= 0) {
            onClear();
            onError("La cantidad debe ser mayor a 0");
            return;
        }

        if (cantidad > producto.stock) {
            onClear();
            onError("No hay suficiente stock");
            return;
        }
        dispatchVentas({
            type: "AGREGAR",
            payload: {
                id_producto: producto.id_producto,
                producto: producto.producto,
                cantidad: cantidad,
                precio_venta: producto.precio_venta
            }
        });

        onSuccess("Producto agregado a la venta");
        setCantidad(1);
    };

    const handleAddCompra = () => {
        if (cantidad <= 0) {
            onClear();
            onError("La cantidad debe ser mayor a 0");
            return;
        }
        if (cantidad > producto.stock) {
            onClear();
            onError("No hay suficiente stock");
            return;
        }
        dispatchCompras({
            type: "AGREGAR",
            payload: {
                id_producto: producto.id_producto,
                producto: producto.producto,
                cantidad: cantidad,
                precio_compra: producto.precio_compra
            }
        });

        onSuccess("Producto agregado a la compra");
        setCantidad(1);
    };

    return (
        <tr className="row">
            <td>{producto.producto}</td>
            <td>{producto.descripcion}</td>
            <td>{producto.stock}</td>
            <td>{producto.precio_venta}</td>
            <td>{producto.categoria}</td>

            <td className="row-actions">
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(producto)} className="row-btn edit">Editar</button>
                        <button onClick={handleDelete} className="row-btn delete">Eliminar</button>
                    </>
                )}
                <input type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
                <button onClick={handleAddVenta} className="row-btn addV">Agregar a venta</button>
                <button onClick={handleAddCompra} className="row-btn addC">Agregar a compra</button>
            </td>
        </tr>
    );
};

export default ProductoRow;