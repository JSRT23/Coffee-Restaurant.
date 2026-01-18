// src/context/CarritoContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // ✅ Cargar carrito desde localStorage al iniciar
    const saved = localStorage.getItem("carrito");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const agregarAlCarrito = (producto) => {
    setItems((prev) => {
      const key = `${producto.id}-${producto.nombre_variante || producto.sku}`;
      const existe = prev.find((item) => item.key === key);
      if (existe) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, cantidad: item.cantidad + producto.cantidad }
            : item
        );
      }
      return [...prev, { ...producto, key, cantidad: producto.cantidad }];
    });
  };

  const eliminarDelCarrito = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const vaciarCarrito = () => {
    setItems([]);
    localStorage.removeItem("carrito");
  };

  const actualizarCantidad = (key, cantidad) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, cantidad } : item))
    );
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
