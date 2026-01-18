// src/pages/Home.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaCoffee,
  FaUtensils,
  FaStar,
  FaLeaf,
  FaHeart,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import "../styles/carousel.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main style={{ backgroundColor: "#fffaf3" }}>
      {/* HERO */}
      <section
        className="text-center text-light d-flex align-items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        ></div>
        <Container className="position-relative z-3">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="fw-bold display-4 mb-3"
            style={{ fontFamily: "Poppins, sans-serif", letterSpacing: "1px" }}
          >
            Bienvenido a{" "}
            <span className="text-warning">Coffee & Restaurant</span>
          </motion.h1>
          <p className="lead mb-4 text-light fs-5">
            Donde el aroma del café se mezcla con los mejores sabores de la
            cocina.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="warning"
              size="lg"
              className="fw-semibold rounded-pill px-4 shadow-lg"
              onClick={() => navigate("/menu")}
            >
              Explorar Menú
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* MÁS VENDIDOS - DESLIZABLE */}
      <ProductCarousel
        title="Productos Más Vendidos"
        icon={<FaStar className="text-warning me-2" />}
        endpoint="productos/mas-vendidos"
        color={{ bg: "#fef7ec" }}
      />

      {/* NUEVOS PRODUCTOS - DESLIZABLE */}
      <ProductCarousel
        title="Nuevas Delicias"
        icon={<FaLeaf className="text-success me-2" />}
        endpoint="productos/nuevos"
        color={{ bg: "#fff" }}
      />

      {/* SOBRE NOSOTROS */}
      <section className="py-5 text-center" style={{ background: "#fffaf0" }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <motion.img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
                alt="Café y ambiente"
                className="img-fluid rounded-4 shadow"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              />
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <h2 className="fw-bold text-brown mb-3">☕ Sobre Nosotros</h2>
              <p className="text-muted mb-3">
                En <strong>Coffee & Restaurant</strong> nos apasiona ofrecer
                experiencias únicas. Desde una taza de café artesanal hasta
                platos gourmet con ingredientes frescos y locales.
              </p>
              <p className="text-muted">
                Ven a disfrutar de un ambiente acogedor, buena música y atención
                de primera. ¡El lugar ideal para compartir, trabajar o
                simplemente relajarte!
              </p>
              <Button
                variant="warning"
                className="fw-semibold mt-3 px-4 rounded-pill"
                onClick={() => navigate("/nosotros")}
              >
                Saber más <FaArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* HORARIOS Y CONTACTO */}
      <section className="py-5 text-light" style={{ background: "#1f1f1f" }}>
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <FaClock className="display-5 text-warning mb-3" />
              <h5 className="fw-bold">Horarios</h5>
              <p className="text-light small mb-0">
                Lunes a Viernes: 7am - 9pm
              </p>
              <p className="text-light small">Sábados y Domingos: 8am - 10pm</p>
            </Col>
            <Col md={4}>
              <FaUtensils className="display-5 text-warning mb-3" />
              <h5 className="fw-bold">Dirección</h5>
              <p className="text-light small mb-0">Calle 45 #12-34, Bogotá</p>
              <p className="text-light small">Zona Gastronómica</p>
            </Col>
            <Col md={4}>
              <FaCoffee className="display-5 text-warning mb-3" />
              <h5 className="fw-bold">Contáctanos</h5>
              <p className="text-light small mb-0">📞 +57 321 654 7890</p>
              <p className="text-light small">📧 contacto@coffeeandrest.co</p>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
