import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiCoffee, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);
      const rol = user?.rol?.toUpperCase();

      if (rol === "MESERO") {
        navigate("/mesero");
      } else if (rol === "COCINERO") {
        navigate("/cocina");
      } else if (rol === "CLIENTE") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #ffffffff, #d4c9c0ff)",
      }}
    >
      <motion.div
        className="card shadow-lg border-0 p-5"
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#fffaf5",
          borderRadius: "15px",
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-4">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3"
            style={{
              width: "75px",
              height: "75px",
              backgroundColor: "#6f4e37",
            }}
          >
            <FiCoffee size={38} color="#fff" />
          </div>
          <h3 className="fw-bold text-dark">Bienvenido de nuevo</h3>
          <p className="text-muted">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2 text-center">{error}</div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiUser />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-group-text bg-light border-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn w-100 text-white fw-semibold"
            style={{
              backgroundColor: "#6f4e37",
              border: "none",
            }}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            ¿No tienes cuenta?{" "}
            <a
              href="/register"
              className="text-decoration-none fw-semibold"
              style={{ color: "#6f4e37" }}
            >
              Regístrate aquí
            </a>
          </small>
        </div>
      </motion.div>
    </div>
  );
}
