import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";
import "./style.css";

const ClienteRow = ({ cliente, onSelect, refresh }: any) => {
    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (!confirm("¿Eliminar cliente?")) return;

        try {
            await api.delete(`cliente/${cliente.id_cliente}`);
            alert("Cliente eliminado");
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido"
            alert(`Error al eliminar el cliente: ${message}`);
        }
    };

    return (
        <tr className="row">
            <td>{cliente.nit}</td>
            <td>{cliente.nombre}</td>

            <td className="row-actions">
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(cliente)} className="row-btn edit">Editar</button>
                        <button onClick={handleDelete} className="row-btn delete">Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default ClienteRow;