import axios from "../api/axios";

// ---------- PRODUCTOS ----------
export const getProductosDisponibles = () =>
  axios.get("/inventario/productos_disponibles/");

// ---------- PEDIDOS ----------
export const crearPedido = (data) => axios.post("/pedidos/pedidos/", data);

export const agregarDetalle = (data) => axios.post("/pedidos/detalles/", data);

export const listarPedidos = (params = {}) =>
  axios.get("/pedidos/pedidos/", { params });

export const actualizarEstadoPedido = async (id, estadoId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.patch(
      `/pedidos/pedidos/${id}/`,
      { estado_id: estadoId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getEstados = () => axios.get("/pedidos/estados/");
export const getMetodosPago = () => axios.get("/pedidos/metodos-pago/");

//  NUEVO: Obtener un pedido por ID
export const obtenerPedido = async (id) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`/pedidos/pedidos/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// 🔥 NUEVO: Actualizar estado (ruta nueva personalizada)
export const actualizarEstadoPedidoMod = async (id, payload) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.patch(
    `/pedidos/pedidos/${id}/actualizar-estado/`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

// 🔥 NUEVO: Actualizar un detalle del pedido
export const actualizarDetalle = async (detalleId, payload) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.patch(
    `/pedidos/detalles/${detalleId}/actualizar/`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

// 🔥 NUEVO: Eliminar un detalle
export const eliminarDetalle = async (detalleId) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.delete(
    `/pedidos/detalles/${detalleId}/eliminar/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// ---------- RESERVAS (MESERO) ----------
const RESERVAS_URL = "/reservas/";

/**
 * Devuelve reservas Pendientes para hoy desde la hora actual en adelante
 * Ruta fija: /reservas/mesero-pendientes/
 */
export const obtenerReservasPendientesHoy = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get("/reservas/mesero-pendientes/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * Confirma una reserva con su código único
 * { codigo: "ABC123" }
 */
export const confirmarReservaConCodigo = async (codigo) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${RESERVAS_URL}confirmar-con-codigo/`,
    { codigo: codigo.trim().toUpperCase() },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

// ---------- CRÉDITOS (MESERO) ----------
const FINANZAS_URL = "/finanzas/";

/**
 * Lista créditos con filtro opcional por username
 */
export const listarCreditosMesero = async (username = "") => {
  const token = localStorage.getItem("token");
  const params = username ? { username } : {};

  const { data } = await axios.get(`${FINANZAS_URL}mesero/creditos/`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return data;
};

/**
 * Registra un abono sobre un crédito existente
 */
export const registrarAbonoMesero = async (
  creditoId,
  monto,
  detalle = "Abono en caja"
) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `${FINANZAS_URL}mesero/abono/`,
    { credito_id: creditoId, monto, detalle },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};
