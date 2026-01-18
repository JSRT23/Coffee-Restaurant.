// utils/dateLimits.js
export const MIN_DATE = new Date().toISOString().split("T")[0]; // hoy
export const MAX_DATE = new Date(new Date().setMonth(new Date().getMonth() + 3))
  .toISOString()
  .split("T")[0];
