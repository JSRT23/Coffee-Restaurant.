import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, Button, Spinner } from "react-bootstrap";
import { FaStar, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { productosService } from "../services/productosService";

/**
 * 🔗 URL base del backend (SIN /api para imágenes)
 */
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "https://krazz.pythonanywhere.com/api"
).replace("/api", "");

/**
 * 🖼️ Siempre devuelve una imagen válida
 */
const buildImageSrc = (path) => {
  if (!path) return "/sin-imagen.jpg";
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path}`;
};

/**
 * 💰 Formato moneda Colombia
 */
const formatCOP = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

export default function ProductCarousel({ title, icon, endpoint, color }) {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const service = endpoint.includes("mas-vendidos")
          ? productosService.getMasVendidos
          : productosService.getNuevos;

        const res = await service();
        setProductos(res.data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [endpoint]);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ background: color.bg }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="text-center py-5 text-danger"
        style={{ background: color.bg }}
      >
        {error}
      </div>
    );
  }

  return (
    <section className="py-5" style={{ background: color.bg }}>
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-brown">
            {icon} {title}
          </h2>
          <p className="text-muted">
            {title.includes("Vendidos")
              ? "Nuestros clientes los aman 💛"
              : "Prueba nuestras últimas creaciones"}
          </p>
        </div>

        <div
          className="d-flex overflow-auto gap-3 pb-3"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {productos.map((prod) =>
            prod.variantes.map((varnt) => {
              const imageSrc = buildImageSrc(
                varnt.imagen_variante || prod.imagen,
              );

              return (
                <div
                  key={varnt.id}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: "start", width: "280px" }}
                >
                  <motion.div whileHover={{ scale: 1.03 }}>
                    <Card className="border-0 shadow-lg rounded-4 h-100">
                      <Card.Img
                        variant="top"
                        src={imageSrc}
                        alt={varnt.nombre_variante || "Sin imagen"}
                        className="rounded-top-4"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                          borderBottom: "2px solid #f8f9fa",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/sin-imagen.jpg";
                        }}
                      />

                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold mb-1 text-dark">
                          {prod.nombre}
                        </Card.Title>

                        <Card.Text className="text-muted small mb-2">
                          {varnt.nombre_variante}
                        </Card.Text>

                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-warning fs-5">
                            {formatCOP(varnt.precio)}
                          </span>

                          <Button
                            variant={
                              title.includes("Vendidos")
                                ? "outline-warning"
                                : "success"
                            }
                            size="sm"
                            onClick={() =>
                              navigate(`/producto/variante/${varnt.id}`, {
                                state: {
                                  producto: prod,
                                  variante: varnt,
                                },
                              })
                            }
                          >
                            {title.includes("Vendidos") ? (
                              <>
                                <FaStar className="me-1" /> Ordenar
                              </>
                            ) : (
                              <>
                                <FaHeart className="me-1" /> Probar
                              </>
                            )}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </div>
              );
            }),
          )}
        </div>
      </div>
    </section>
  );
}
