import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Ventas from "../pages/cruds/Ventas";
import Productos from "../pages/cruds/Productos";
import Compras from "../pages/cruds/Compras";
import Clientes from "../pages/cruds/Clientes";
import Proveedores from "../pages/cruds/Proveedores";
import Empleados from "../pages/cruds/Empleados";
import Personas from "../pages/cruds/Personas";

export const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute requireAdmin={false}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Ventas /> },
            { path: "productos", element: <Productos /> },
            { path: "compras", element: <Compras /> },
            { path: "clientes", element: <Clientes /> },
            { path: "proveedores", element: <Proveedores /> },
            { path: "empleados", element: <Empleados /> },
            { path: "personas", element: <Personas /> }
        ]
    },
    { path: "*", element: <Navigate to="/dashboard" replace /> }
]);