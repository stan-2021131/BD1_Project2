import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";

const EmpleadoRow = ({ empleado, onSelect, refresh }: any) => {
    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (!confirm("¿Eliminar empleado?")) return;

        try {
            await api.delete(`empleado/${empleado.id_empleado}`);
            alert("Empleado eliminado");
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido";
            alert(`Error al eliminar empleado: ${message}`);
        }
    };

    return (
        <tr>
            <td>{empleado.usuario}</td>
            <td>{empleado.nombre}</td>
            <td>{empleado.rol}</td>

            <td>
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(empleado)}>Editar</button>
                        <button onClick={handleDelete}>Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default EmpleadoRow;