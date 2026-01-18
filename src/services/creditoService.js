import axios from "../api/axios";

export const creditoAPI = {
  // CRUD básico
  listar: () => axios.get("/finanzas/creditos/"),
  crear: (payload) => axios.post("/finanzas/creditos/", payload),

  // Acciones
  consumir: (id, data) =>
    axios.post(`/finanzas/creditos/${id}/consumir/`, data),
  pagar: (id, data) => axios.post(`/finanzas/creditos/${id}/pagar/`, data),

  // Sub-recursos
  movimientos: (id, params = {}) =>
    axios.get(`/finanzas/creditos/${id}/movimientos/`, { params }),
  auditorias: (id) => axios.get(`/finanzas/creditos/${id}/auditorias/`),

  // Acreditación
  solicitudes: {
    listar: () => axios.get("/finanzas/solicitudes/"),
    crear: (data) => axios.post("/finanzas/solicitudes/", data),
    responder: (id, data) =>
      axios.patch(`/finanzas/solicitudes/${id}/responder/`, data),
    estados: () => axios.get("/finanzas/solicitudes/estados/"),
  },
};
