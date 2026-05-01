import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/Api";
import { useUser } from "../../context/UserContext";

const Login = () => {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");

        try {
            const data = await api.post("empleado/login", { usuario, contrasena });
            login(data.data); //guardar usuario
            navigate("/dashboard");   //ir a dashboard
        } catch (err) {
            setError("Credenciales incorrectas.");
        }
    };

    return (
        <div>
            <h1>Sistema de Gestión de Inventarios</h1>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Ingresar</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};
export default Login;