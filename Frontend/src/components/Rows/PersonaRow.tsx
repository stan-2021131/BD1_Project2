import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";
import "./style.css";

const PersonaRow = ({ persona, onSelect, refresh }: any) => {
    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (!confirm("¿Eliminar persona?")) return;

        try {
            await api.delete(`persona/${persona.id_persona}`);
            alert("Persona eliminada");
            refresh();
        } catch (error: any) {
            console.error(error);
            const message = error.message || "Error desconocido";
            alert(`Error al eliminar persona: ${message}`);
        }
    };

    return (
        <tr className="row">
            <td>{persona.nombre}</td>

            <td className="row-actions">
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(persona)} className="row-btn edit">Editar</button>
                        <button onClick={handleDelete} className="row-btn delete">Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default PersonaRow;