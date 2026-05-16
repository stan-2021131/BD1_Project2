import { api } from "../../services/Api";
import { useUser } from "../../context/UseUser";
import "./style.css";

const EmpleadoRow = ({ empleado, onSelect, refresh, onSuccess, onError, onClear }: any) => {
    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (Number(empleado.id_empleado) === Number(user?.id_empleado)) {
            onError("No se puede eliminar a sí mismo");
            return;
        }
        if (!confirm("¿Eliminar empleado?")) return;

        onClear();

        try {
            await api.delete(`empleado/${empleado.id_empleado}`);
            onSuccess("Empleado eliminado exitosamente");
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido";
            onError(`Error al eliminar empleado: ${message}`);
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