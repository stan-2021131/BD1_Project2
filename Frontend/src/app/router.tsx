import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Ventas from "../pages/cruds/Ventas";
import Productos from "../pages/cruds/Productos";

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
        ]
    }
]);