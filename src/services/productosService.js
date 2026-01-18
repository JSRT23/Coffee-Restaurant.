//src/services/productosService.js
import axios from "../api/axios";

const ENDPOINT = "/inventario";

export const productosService = {
  getMenu() {
    return axios.get(`${ENDPOINT}/menu/menu/`);
  },
  getMasVendidos() {
    return axios.get(`${ENDPOINT}/productos/mas-vendidos/`);
  },
  getNuevos() {
    return axios.get(`${ENDPOINT}/productos/nuevos/`);
  },

  getProductoById(id) {
    return axios.get(`${ENDPOINT}/variantes/${id}/`);
  },

  getStockBajo() {
    return axios.get(`${ENDPOINT}/productos/stock-bajo/`);
  },
};
