import { useState } from "react";
import { useUser } from "../../context/UseUser";
import { NavLink } from "react-router-dom";

import "./style.css";

const Navbar = () => {

    const { user, logout } = useUser();

    const [open, setOpen] = useState(false);

    if (!user) return null;

    const isAdmin = Number(user.id_rol) === 1;

    return (
        <nav className="navbar">

            <div className="navbar-top">

                <div className="navbar-left">
                    <h3>
                        Bienvenido: {user.usuario}
                    </h3>
                </div>

                <button
                    className="menu-btn"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

            </div>

            <div className={`navbar-right ${open ? "open" : ""}`}>

                {/* TODOS */}
                <NavLink to="/dashboard">
                    Ventas
                </NavLink>

                <NavLink to="/dashboard/compras">
                    Compras
                </NavLink>

                <NavLink to="/dashboard/productos">
                    Productos
                </NavLink>

                {/* ADMIN */}
                {isAdmin && (
                    <>
                        <NavLink to="/dashboard/clientes">
                            Clientes
                        </NavLink>

                        <NavLink to="/dashboard/proveedores">
                            Proveedores
                        </NavLink>

                        <NavLink to="/dashboard/empleados">
                            Empleados
                        </NavLink>

                        <NavLink to="/dashboard/personas">
                            Personas
                        </NavLink>

                        <NavLink to="/dashboard/categorias">
                            Categorías
                        </NavLink>

                        <NavLink to="/dashboard/reportes">
                            Reportes
                        </NavLink>
                    </>
                )}

                <span
                    className="logout"
                    onClick={logout}
                >
                    Cerrar sesión
                </span>

            </div>

        </nav>
    );
};

export default Navbar;