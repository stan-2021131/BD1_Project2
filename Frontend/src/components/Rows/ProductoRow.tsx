import { api } from "../../services/Api";
import { useContext, useState } from "react";
import { useUser } from "../../context/UserContext";
import { CarritoComprasContext, CarritoVentasContext } from "../../context/CarritoContext";

const ProductoRow = ({ producto, onSelect, refresh }: any) => {
    const [cantidad, setCantidad] = useState(1);

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    // Consumo de carritos
    const { dispatch: dispatchVentas } = useContext(CarritoVentasContext);
    const { dispatch: dispatchCompras } = useContext(CarritoComprasContext);

    const handleDelete = async () => {
        if (!confirm("¿Eliminar producto?")) return;

        await api.delete(`producto/${producto.id_producto}`);
        refresh();
    };

    const handleAddVenta = () => {
        if (cantidad <= 0) {
            alert("La cantidad debe ser mayor a 0");
            return;
        }

        if (cantidad > producto.stock) {
            alert("No hay suficiente stock");
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

        alert("Producto agregado a la venta");
        setCantidad(1);
    };

    const handleAddCompra = () => {
        if (cantidad <= 0) {
            alert("La cantidad debe ser mayor a 0");
            return;
        }
        if (cantidad > producto.stock) {
            alert("No hay suficiente stock");
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

        alert("Producto agregado a la compra");
        setCantidad(1);
    };

    return (
        <tr>
            <td>{producto.producto}</td>
            <td>{producto.descripcion}</td>
            <td>{producto.stock}</td>
            <td>{producto.precio_venta}</td>
            <td>{producto.categoria}</td>

            <td>
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(producto)}>Editar</button>
                        <button onClick={handleDelete}>Eliminar</button>
                    </>
                )}
                <>
                    <input type="number" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
                    <button onClick={handleAddVenta}>Agregar a venta</button>
                    <button onClick={handleAddCompra}>Agregar a compra</button>
                </>
            </td>
        </tr>
    );
};

export default ProductoRow;