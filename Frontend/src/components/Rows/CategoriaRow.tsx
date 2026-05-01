import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";
import "./style.css";

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
        <tr className="row">
            <td>{categoria.categoria}</td>

            <td className="row-actions">
                {isAdmin && (
                    <>
                        <button onClick={() => onSelect(categoria)} className="row-btn edit">Editar</button>
                        <button onClick={handleDelete} className="row-btn delete">Eliminar</button>
                    </>
                )}
            </td>
        </tr>
    );
};

export default CategoriaRow;