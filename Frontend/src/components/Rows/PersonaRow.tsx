import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";

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
        <tr>
            <td>{persona.nombre}</td>

            <td>
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(persona)}>Editar</button>
                        <button onClick={handleDelete}>Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default PersonaRow;