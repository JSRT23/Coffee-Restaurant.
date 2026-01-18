import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { productosService } from "../services/productosService";

export default function ProductDetail({ producto }) {
  const [variantes, setVariantes] = useState([]);
  const [selectedVariante, setSelectedVariante] = useState(null);
  const [varianteData, setVarianteData] = useState(null);

  // Simulamos que las variantes del producto llegan como prop
  useEffect(() => {
    if (producto?.variantes) {
      setVariantes(producto.variantes);
    }
  }, [producto]);

  // Cuando cambia la variante seleccionada, se obtiene su info
  useEffect(() => {
    const fetchVariante = async (id) => {
      try {
        const response = await productosService.getProductoById(id);
        setVarianteData(response.data);
      } catch (error) {
        console.error("❌ Error al cargar variante:", error);
      }
    };

    if (selectedVariante) {
      fetchVariante(selectedVariante.id);
    }
  }, [selectedVariante]);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          {varianteData ? (
            <motion.img
              src={varianteData.imagen_variante || "/placeholder.png"}
              alt={varianteData.nombre_variante}
              className="img-fluid rounded shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            />
          ) : (
            <p>Selecciona una variante para ver detalles</p>
          )}
        </Col>

        <Col md={6}>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-3">{producto.nombre}</h3>
            <p>{producto.descripcion}</p>

            <div className="mb-3">
              <strong>Seleccionar Variante:</strong>
              <div className="d-flex flex-wrap mt-2">
                {variantes.map((v) => (
                  <Button
                    key={v.id}
                    variant={
                      selectedVariante?.id === v.id
                        ? "primary"
                        : "outline-primary"
                    }
                    className="me-2 mb-2"
                    onClick={() => setSelectedVariante(v)}
                  >
                    {v.nombre_variante}
                  </Button>
                ))}
              </div>
            </div>

            {varianteData && (
              <Card className="shadow-sm border-0 mt-3">
                <Card.Body>
                  <h5>{varianteData.nombre_variante}</h5>
                  <p className="mb-1">💰 Precio: ${varianteData.precio}</p>
                  <p className="mb-1">📦 Stock: {varianteData.stock}</p>
                  <p className="mb-0">🔖 SKU: {varianteData.sku}</p>
                </Card.Body>
              </Card>
            )}
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
