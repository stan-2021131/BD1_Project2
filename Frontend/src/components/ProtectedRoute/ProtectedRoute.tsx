import { useUser } from "../../context/UseUser";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, loading } = useUser();

    if (loading) return <p>Cargando...</p>;
    if (!user) return <Navigate to="/" />;

    if (requireAdmin && Number(user.id_rol) !== 1) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;