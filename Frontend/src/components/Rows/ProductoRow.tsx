import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";

const ProductoRow = ({ producto, onSelect, refresh }: any) => {

    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (!confirm("¿Eliminar producto?")) return;

        await api.delete(`producto/${producto.id_producto}`);
        refresh();
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
            </td>
        </tr>
    );
};

export default ProductoRow;