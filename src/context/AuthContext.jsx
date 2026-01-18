// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "../api/axios";
import { refreshToken, logout as cerrarSesion } from "../services/authServices";
import Swal from "sweetalert2";
import { useCarrito } from "./CarritoContext";

const AuthContext = createContext();

// Detecta si es recarga y no cierre real
const isReload = () => {
  const nav = performance.getEntriesByType("navigation")[0];
  return nav && nav.type === "reload";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionTimer = useRef(null);
  const alertaActiva = useRef(false);
  const iniciado = useRef(false); // ← evita doble ejecución por StrictMode

  const { vaciarCarrito } = useCarrito();

  useEffect(() => {
    if (iniciado.current) return; // ← NO permitir doble ejecución
    iniciado.current = true;

    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/usuarios/auth/me/");
        setUser(data);
        configurarSesion(data.rol);
      } catch {
        const nuevo = await refreshToken();
        if (nuevo) {
          const { data } = await axios.get("/usuarios/auth/me/");
          setUser(data);
          configurarSesion(data.rol);
        } else {
          cerrarSesionYCarrito();
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Cerrar sesión solo al cerrar pestaña
  useEffect(() => {
    const onClose = () => {
      if (!isReload()) {
        cerrarSesion();
      }
    };

    window.addEventListener("beforeunload", onClose);
    return () => window.removeEventListener("beforeunload", onClose);
  }, []);

  // -------------------------
  //  CONFIGURAR SESIÓN
  // -------------------------
  const configurarSesion = (rol) => {
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    alertaActiva.current = false;

    if (rol === "COCINERO") return;

    sessionTimer.current = setTimeout(() => avisoExpira(rol), 15 * 60 * 1000);
  };

  // -------------------------
  //   AVISO UNA SOLA VEZ
  // -------------------------
  const avisoExpira = async (rol) => {
    if (alertaActiva.current) return;
    alertaActiva.current = true;

    const result = await Swal.fire({
      title: "⏳ Tu sesión está por expirar",
      text: "¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Seguir trabajando",
    });

    if (result.isConfirmed) {
      cerrarSesionYCarrito();
      return;
    }

    const nuevo = await refreshToken();
    if (!nuevo) {
      cerrarSesionYCarrito();
      return;
    }

    configurarSesion(rol);
  };

  // -------------------------
  //  LOGIN
  // -------------------------
  const login = async (username, password) => {
    const { data } = await axios.post("/usuarios/auth/login/", {
      username,
      password,
    });

    localStorage.setItem("token", data.access);
    localStorage.setItem("refresh", data.refresh);

    const me = await axios.get("/usuarios/auth/me/");
    setUser(me.data);

    configurarSesion(me.data.rol);

    return me.data;
  };

  // -------------------------
  //  LOGOUT
  // -------------------------
  const logout = () => cerrarSesionYCarrito();

  const cerrarSesionYCarrito = () => {
    clearTimeout(sessionTimer.current);
    cerrarSesion();
    setUser(null);
    vaciarCarrito();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
