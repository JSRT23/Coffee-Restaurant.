// src/services/reservasService.js
import axios from "../api/axios"; // tu instancia con interceptores

/* -----------  RESERVAS  ----------- */
export const crearReserva = (body) =>
  axios.post("/reservas/crear/", body).then((res) => res.data);

export const listarMisReservas = () =>
  axios.get("/reservas/mis/").then((res) => res.data);

/* -----------  MESAS  ----------- */
export const mesasDisponibles = ({
  fecha,
  hora_inicio,
  numero_personas,
  ubicacion_id,
}) => {
  const params = new URLSearchParams({
    fecha,
    hora_inicio,
    numero_personas,
    ...(ubicacion_id && { ubicacion_id }),
  });
  return axios
    .get(`/reservas/mesas-disponibles/?${params}`)
    .then((res) => res.data);
};

/* -----------  CATÁLOGOS  ----------- */
export const listarUbicaciones = () =>
  axios.get("/reservas/ubicaciones/").then((res) => res.data);

export const listarEstados = () =>
  axios.get("/reservas/estados/").then((res) => res.data);
