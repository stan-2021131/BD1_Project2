import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useUser();

    if (!user) return null;

    const isAdmin = Number(user.id_rol) === 1;

    return (
        <nav>
            <h3>Bienvenido: {user.usuario}</h3>

            {/*Opciones para TODOS */}
            <Link to="/"><button>Compras</button></Link>
            <Link to="/"><button>Ventas</button></Link>
            <Link to="/productos"><button>Productos</button></Link>

            {/*Solo admin */}
            {isAdmin && (
                <>
                    <button>Clientes</button>
                    <button>Proveedores</button>
                    <button>Empleados</button>
                    <button>Categorías</button>
                    <button>Reportes</button>
                </>
            )}

            <button onClick={logout}>Cerrar sesión</button>
        </nav>
    );
};

export default Navbar;