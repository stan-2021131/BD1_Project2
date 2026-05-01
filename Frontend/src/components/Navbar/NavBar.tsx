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
            <Link to="/dashboard"><button>Ventas</button></Link>
            <Link to="/dashboard/compras"><button>Compras</button></Link>
            <Link to="/dashboard/productos"><button>Productos</button></Link>

            {/*Solo admin */}
            {isAdmin && (
                <>
                    <Link to={"/dashboard/clientes"}><button>Clientes</button></Link>
                    <Link to={"/dashboard/proveedores"}><button>Proveedores</button></Link>
                    <Link to={"/dashboard/empleados"}><button>Empleados</button></Link>
                    <Link to={"/dashboard/personas"}><button>Personas</button></Link>
                    <Link to={"/dashboard/categorias"}><button>Categorías</button></Link>
                    <button>Reportes</button>
                </>
            )}

            <button onClick={logout}>Cerrar sesión</button>
        </nav>
    );
};

export default Navbar;