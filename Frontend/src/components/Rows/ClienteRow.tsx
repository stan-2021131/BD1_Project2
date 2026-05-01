import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";

const ClienteRow = ({ cliente, onSelect, refresh }: any) => {
    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (!confirm("¿Eliminar cliente?")) return;

        try {
            await api.delete(`cliente/${cliente.id_cliente}`);
            refresh();
        } catch (error: any) {
            console.error(error);
            alert(`Error al eliminar el cliente: ${error}`);
        }

    };

    return (
        <tr>
            <td>{cliente.nit}</td>
            <td>{cliente.nombre}</td>

            <td>
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(cliente)}>Editar</button>
                        <button onClick={handleDelete}>Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default ClienteRow;