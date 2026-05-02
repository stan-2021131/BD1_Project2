import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import "./style.css";

const Navbar = () => {
    const { user, logout } = useUser();

    if (!user) return null;

    const isAdmin = Number(user.id_rol) === 1;

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h3>Bienvenido: {user.usuario}</h3>
            </div>

            <div className="navbar-right">

                {/* TODOS */}
                <Link to="/dashboard">Ventas</Link>
                <Link to="/dashboard/compras">Compras</Link>
                <Link to="/dashboard/productos">Productos</Link>

                {/* ADMIN */}
                {isAdmin && (
                    <>
                        <Link to="/dashboard/clientes">Clientes</Link>
                        <Link to="/dashboard/proveedores">Proveedores</Link>
                        <Link to="/dashboard/empleados">Empleados</Link>
                        <Link to="/dashboard/personas">Personas</Link>
                        <Link to="/dashboard/categorias">Categorías</Link>
                        <Link to="/dashboard/reportes">Reportes</Link>
                    </>
                )}

                <span className="logout" onClick={logout}>
                    Cerrar sesión
                </span>
            </div>
        </nav>
    );
};

export default Navbar;