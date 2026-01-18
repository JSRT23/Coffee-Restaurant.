import { motion } from "framer-motion";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaCoffee,
  FaUserTie,
  FaHeart,
  FaArrowLeft,
  FaClipboardCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nosotros() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        background: "#fffaf3",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* 🔙 BOTÓN DE VOLVER */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1000,
        }}
      >
        <Button
          variant="warning"
          className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
          style={{
            width: "45px",
            height: "45px",
            padding: 0,
            border: "none",
          }}
          onClick={() => navigate("/")}
        >
          <FaArrowLeft size={20} color="#fff" />
        </Button>
      </motion.div>

      {/* ☕ SECCIÓN PRINCIPAL */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <motion.img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900"
                alt="Café y ambiente"
                className="img-fluid rounded-4 shadow"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              />
            </Col>
            <Col md={6}>
              <h1 className="fw-bold text-brown mb-3">
                ☕ Sobre Coffee & Restaurant
              </h1>
              <p className="text-muted">
                Somos una cafetería y restaurante que nació del amor por el buen
                café y la comida de calidad. Creemos en los sabores auténticos,
                los ingredientes frescos y la calidez de un ambiente donde cada
                detalle cuenta.
              </p>
              <p className="text-muted">
                Desde nuestros inicios, buscamos crear un espacio donde los
                clientes se sientan en casa. Hoy seguimos innovando, ofreciendo
                nuevas experiencias que mezclan tradición y modernidad.
              </p>
            </Col>
          </Row>

          {/* 💛 SECCIÓN DE INFORMACIÓN */}
          <Row className="mt-5 text-center">
            <Col md={4}>
              <FaCoffee className="display-5 text-warning mb-3" />
              <h5 className="fw-bold">Pasión por el Café</h5>
              <p className="text-muted small">
                Seleccionamos granos 100% colombianos y los preparamos con arte.
              </p>
            </Col>
            <Col md={4}>
              <FaUserTie className="display-5 text-warning mb-3" />
              <h5 className="fw-bold">Nuestro Creador</h5>
              <p className="text-muted small">
                Fundado por <strong>Juan Sebastián Ramos Torralvo</strong>,
                ingeniero apasionado por la tecnología y la gastronomía.
              </p>
            </Col>
            <Col md={4}>
              <FaHeart className="display-5 text-warning mb-3" />
              <h5 className="fw-bold">Nuestra Filosofía</h5>
              <p className="text-muted small">
                Calidad, dedicación y amor por cada taza y cada plato que
                servimos.
              </p>
            </Col>
          </Row>

          {/* 📋 SECCIÓN DE POLÍTICAS */}
          <motion.section
            className="mt-5 pb-5"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-0 shadow-sm rounded-4 p-4 bg-light">
              <Row className="align-items-center">
                <Col md={2} className="text-center">
                  <FaClipboardCheck className="display-5 text-warning" />
                </Col>
                <Col md={10}>
                  <h4 className="fw-bold text-dark mb-3">
                    📝 Políticas de Reservas y Acreditación
                  </h4>
                  <p className="text-muted mb-2">
                    Las reservas deben realizarse con al menos 24 horas de
                    anticipación para garantizar la disponibilidad del espacio.
                  </p>
                  <p className="text-muted mb-2">
                    Los clientes deberán confirmar su asistencia 2 horas antes
                    del horario establecido; de lo contrario, la reserva podrá
                    ser liberada.
                  </p>
                  <p className="text-muted mb-2">
                    Toda reserva confirmada genera un comprobante digital que
                    acredita su validez y debe presentarse al llegar al
                    establecimiento.
                  </p>
                  <p className="text-muted mb-0">
                    Coffee & Restaurant se reserva el derecho de modificar las
                    condiciones de reserva en fechas especiales o eventos
                    privados. Recomendamos consultar nuestras actualizaciones en
                    el sitio web.
                  </p>
                </Col>
              </Row>
            </Card>
          </motion.section>
        </Container>
      </section>
    </main>
  );
}
