import axios from "../api/axios";

/**
 * Maneja la persistencia y refresco del token JWT.
 * Usado internamente por AuthContext.
 */
export const useAuthToken = () => {
  //Obtiene el token actual
  const getAccessToken = () => localStorage.getItem("token");
  const getRefreshToken = () => localStorage.getItem("refresh");

  //  Guarda los tokens
  const setTokens = (access, refresh) => {
    if (access) localStorage.setItem("token", access);
    if (refresh) localStorage.setItem("refresh", refresh);
  };

  //Elimina los tokens (logout)
  const clearTokens = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  // Refresca el access token usando el refresh token
  const refreshAccessToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    try {
      const { data } = await axios.post("/usuarios/auth/refresh/", {
        refresh,
      });
      setTokens(data.access, refresh);
      console.log("🔁 Token actualizado automáticamente");
      return data.access;
    } catch (err) {
      console.warn("⚠️ No se pudo refrescar el token:", err.response?.data);
      clearTokens();
      return null;
    }
  };

  return {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
    refreshAccessToken,
  };
};
