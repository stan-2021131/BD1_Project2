import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";
import "./style.css";

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
        <tr className="row">
            <td>{empleado.usuario}</td>
            <td>{empleado.nombre}</td>
            <td>{empleado.rol}</td>

            <td className="row-actions">
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(empleado)} className="row-btn edit">Editar</button>
                        <button onClick={handleDelete} className="row-btn delete">Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default EmpleadoRow;