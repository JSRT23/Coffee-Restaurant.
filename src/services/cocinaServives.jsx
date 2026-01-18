// src/services/meseroService.js
import axios from "../api/axios";

// 🔥 UNIVERSAL → Funciona para MESERO y COCINERO
export const listarPedidos = async (params = {}) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get("/pedidos/pedidos/", {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return data;
};

// Actualizar estado del pedido
export const actualizarEstadoPedido = async (id, estadoId) => {
  const token = localStorage.getItem("token");

  try {
    const { data } = await axios.patch(
      `/pedidos/pedidos/${id}/`,
      { estado_id: estadoId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("🔴 Error al actualizar pedido:", error.response?.data);
    throw error;
  }
};

// Obtener estados
export const getEstados = () => axios.get("/pedidos/estados/");

// Obtener métodos de pago
export const getMetodosPago = () => axios.get("/pedidos/metodos-pago/");

// Obtener un pedido por ID (incluye detalles)
export const obtenerPedido = async (id) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`/pedidos/pedidos/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

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
