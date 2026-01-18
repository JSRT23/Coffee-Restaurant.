import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaBox,
  FaBarcode,
  FaTag,
  FaWarehouse,
  FaShoppingCart,
} from "react-icons/fa";
import { productosService } from "../services/productosService";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import Swal from "sweetalert2";
import "../styles/VarianteDetalle.css";

export default function VarianteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [variante, setVariante] = useState(null);
  const [qty, setQty] = useState(1);

  const { user } = useAuth();
  const { agregarAlCarrito, items } = useCarrito();
  const isLoggedIn = !!user;

  useEffect(() => {
    productosService
      .getProductoById(id)
      .then((response) => setVariante(response.data))
      .catch((error) => console.error("❌ Error al cargar variante:", error));
  }, [id]);

  if (!variante) {
    return (
      <Container className="text-center mt-5">
        <h4>Cargando información...</h4>
      </Container>
    );
  }

  const handleAdd = () => {
    if (!isLoggedIn) return;

    const key = `${variante.id}-${variante.nombre_variante || variante.sku}`;
    const existente = items.find((item) => item.key === key);
    const cantidadExistente = existente ? existente.cantidad : 0;

    if (cantidadExistente + qty > variante.stock_disponible) {
      Swal.fire({
        icon: "warning",
        title: "¡Stock insuficiente!",
        text: `Solo quedan ${
          variante.stock_disponible - cantidadExistente
        } unidades disponibles de esta variante.`,
      });
      return;
    }

    // Preparar objeto para carrito incluyendo codigo_barras e imagen
    const itemCarrito = {
      id: variante.id,
      key: key,
      producto_nombre: variante.nombre,
      nombre_variante: variante.nombre_variante,
      precio: variante.precio,
      sku: variante.sku,
      codigo_barra: variante.codigo_barras || "—",
      stock: variante.stock_disponible,
      imagen: variante.imagen_variante || variante.imagen || "",
      cantidad: qty,
    };

    agregarAlCarrito(itemCarrito);

    Swal.fire({
      icon: "success",
      title: "¡Agregado!",
      text: `${qty} unidad(es) de ${variante.nombre_variante} se agregaron al carrito`,
      timer: 1500,
      showConfirmButton: false,
    });

    setQty(1);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
      <Card className="detalle-card shadow-lg border-0 rounded-4 p-4">
        <div className="d-flex justify-content-start mb-3">
          <Button
            variant="light"
            className="btn-volver shadow-sm"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-1" /> Volver
          </Button>
        </div>

        <Row className="align-items-center g-4">
          <Col md={6} className="text-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="image-container rounded-4"
            >
              {variante.imagen_variante || variante.imagen ? (
                <img
                  src={variante.imagen_variante || variante.imagen}
                  alt={variante.nombre_variante}
                  className="img-fluid rounded-4 shadow-sm imagen-fija"
                />
              ) : (
                <div className="no-image bg-light rounded-4 d-flex flex-column align-items-center justify-content-center border border-2 text-muted">
                  <FaBox size={70} className="mb-3" />
                  <p>Sin imagen disponible</p>
                </div>
              )}
            </motion.div>
          </Col>

          <Col md={6}>
            <h2 className="fw-bold text-dark mb-1">
              {variante.nombre_variante}
            </h2>

            <p className="text-secondary mb-2">
              <FaTag className="text-primary me-2" />
              <strong>Código:</strong> {variante.sku}
            </p>

            <p className="text-muted mb-4">
              <FaBarcode className="text-dark me-2" />
              <strong>Código de barras:</strong> {variante.codigo_barras || "—"}
            </p>

            <p className="text-secondary mb-4">
              <FaWarehouse className="text-warning me-2" />
              <strong>Stock disponible:</strong> {variante.stock_disponible}
            </p>

            <div className="mt-3 d-flex align-items-center gap-3">
              <span className="text-muted">Cantidad:</span>
              <Form.Control
                type="number"
                min={1}
                max={variante.stock_disponible}
                value={qty}
                onChange={(e) =>
                  setQty(
                    Math.max(
                      1,
                      Math.min(
                        parseInt(e.target.value) || 1,
                        variante.stock_disponible
                      )
                    )
                  )
                }
                style={{ width: 90 }}
              />
            </div>

            <div className="mt-4 d-flex align-items-center justify-content-between">
              <h3 className="fw-bold text-dark mb-0 precio-detalle">
                {parseFloat(variante.precio).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </h3>

              <OverlayTrigger
                placement="top"
                overlay={
                  !isLoggedIn ? (
                    <Tooltip id="tooltip-disabled">
                      🔒 Inicia sesión para agregar al carrito
                    </Tooltip>
                  ) : (
                    <></>
                  )
                }
              >
                <span className="d-inline-block">
                  <Button
                    className="btn-agregar px-4 py-2 d-flex align-items-center gap-2"
                    disabled={!isLoggedIn}
                    onClick={handleAdd}
                  >
                    <FaShoppingCart /> Agregar al carrito
                  </Button>
                </span>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
