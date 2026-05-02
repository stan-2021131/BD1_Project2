import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";
import "./style.css";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await api.post("empleado/login", { usuario, contrasena });

            login(data.data);
            navigate("/dashboard");

        } catch (err: any) {
            setError(err.message || "Credenciales incorrectas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">
                <h1 className="login-title">Sistema de Inventarios</h1>
                <h2 className="login-subtitle">Iniciar Sesión</h2>

                <form onSubmit={handleSubmit} className="login-form">

                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <input
                            className="form-input"
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            className="form-input"
                            type="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button className="form-btn login-btn" type="submit">
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>

                </form>
            </div>

        </div>
    );
};

export default Login;