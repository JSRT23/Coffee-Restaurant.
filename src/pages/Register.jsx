import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCoffee } from "react-icons/fi";
import Swal from "sweetalert2";
import axios from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Usuario es requerido";
    if (!form.email) newErrors.email = "Correo es requerido";
    if (!form.password) newErrors.password = "Contraseña es requerida";
    if (form.password !== form.password2)
      newErrors.password2 = "Las contraseñas no coinciden";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await axios.post("/usuarios/auth/registro/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      Swal.fire({
        icon: "success",
        title: "¡Cuenta creada!",
        text: "Tu usuario fue registrado exitosamente. Ahora inicia sesión.",
        confirmButtonColor: "#6f4e37",
        background: "#fff",
      }).then(() => navigate("/login"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al registrarse",
        text: "Ocurrió un problema. Inténtalo de nuevo.",
        confirmButtonColor: "#8B4513",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f5f1ee 0%, #eae4de 50%, #f5f3f2 100%)",
        paddingTop: "100px",
        paddingBottom: "100px",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{
          width: "800px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div
              className="rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3 shadow-sm"
              style={{
                width: "75px",
                height: "75px",
                backgroundColor: "#6f4e37",
              }}
            >
              <FiCoffee size={35} color="#fff" />
            </div>
            <h2 className="fw-bold mt-2 text-dark">Crear cuenta</h2>
            <p className="text-muted mb-4">
              Únete a nuestra cafetería y disfruta de la mejor experiencia ☕
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Usuario */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Usuario</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Tu nombre de usuario"
                    value={form.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
              </div>

              {/* Correo */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Correo electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="ejemplo@correo.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Tu contraseña"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Confirmar contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-shield-lock"></i>
                  </span>
                  <input
                    type="password"
                    name="password2"
                    className={`form-control ${
                      errors.password2 ? "is-invalid" : ""
                    }`}
                    placeholder="Repite tu contraseña"
                    value={form.password2}
                    onChange={handleChange}
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn text-white fw-semibold py-2"
                disabled={loading}
                style={{
                  background:
                    "linear-gradient(90deg, #8B4513 0%, #6f4e37 100%)",
                  transition: "0.3s",
                }}
              >
                {loading ? (
                  <>
                    <i className="bi bi-arrow-repeat me-2 spin"></i>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Crear cuenta
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted">
              ¿Ya tienes cuenta?{" "}
              <a
                href="/login"
                className="fw-semibold text-decoration-none"
                style={{ color: "#6f4e37" }}
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
