import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";
import "./style.css";


const ProveedorRow = ({ proveedor, onSelect, refresh }: any) => {
    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (!confirm("¿Eliminar proveedor?")) return;

        try {
            await api.delete(`proveedor/${proveedor.id_proveedor}`);
            alert("Proveedor eliminado");
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido";
            alert(`Error al eliminar el proveedor: ${message}`);
        }
    };

    return (
        <tr className="row">
            <td>{proveedor.proveedor}</td>
            <td>{proveedor.direccion}</td>
            <td>{proveedor.contacto}</td>

            <td className="row-actions">
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(proveedor)} className="row-btn edit">Editar</button>
                        <button onClick={handleDelete} className="row-btn delete">Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default ProveedorRow;