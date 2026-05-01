import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";

const CategoriaRow = ({ categoria, onSelect, refresh }: any) => {
    const { user } = useUser();
    const isAdmin = Number(user?.id_rol) === 1;

    const handleDelete = async () => {
        if (!confirm("¿Eliminar categoría?")) return;

        try {
            await api.delete(`categoria/${categoria.id_categoria}`);
            alert("Categoría eliminada");
            refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error al eliminar categoría");
        }
    };

    return (
        <tr>
            <td>{categoria.categoria}</td>

            <td>
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(categoria)}>Editar</button>
                        <button onClick={handleDelete}>Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default CategoriaRow;