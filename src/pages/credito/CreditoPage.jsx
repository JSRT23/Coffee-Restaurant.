import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Modal,
  Badge,
} from "react-bootstrap";
import { FaHistory, FaFileInvoiceDollar, FaEye } from "react-icons/fa";
import { creditoAPI } from "../../services/creditoService";
import "../../styles/credito.css";

export default function CreditoPage() {
  const [credito, setCredito] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [monto, setMonto] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [credRes, solRes] = await Promise.all([
        creditoAPI.listar(),
        creditoAPI.solicitudes.listar(),
      ]);
      const credit = credRes.data[0] || null;
      setCredito(credit);
      setSolicitudes(solRes.data);
      if (credit) {
        const aud = await creditoAPI.auditorias(credit.id);
        setAuditorias(aud.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await creditoAPI.solicitudes.crear({
        monto_solicitado: parseFloat(monto),
      });
      Swal.fire({
        icon: "success",
        title: "¡Solicitud enviada!",
        text: "Tu solicitud está en revisión.",
        confirmButtonColor: "#0d6efd",
      });
      setMonto("");
      fetchData();
    } catch (err) {
      const msg =
        err.response?.data &&
        Object.values(err.response.data).flat().join(" / ");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg || "Error al enviar solicitud",
        confirmButtonColor: "#d33",
      });
    } finally {
      setEnviando(false);
    }
  };

  const abrirModal = (item) => {
    // Limpiamos datos sensibles y formateamos
    const clean = { ...item };
    delete clean.id;
    delete clean.cliente;
    delete clean.usuario;
    if (clean.credito) clean.credito = `Crédito #${clean.credito}`;
    if (clean.fecha)
      clean.fecha = new Date(clean.fecha).toLocaleString("es-ES");
    setDetalleSeleccionado(clean);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setDetalleSeleccionado(null);
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando información...</p>
      </div>
    );

  return (
    <Container className="py-5">
      <motion.h2
        className="text-center mb-5 fw-bold "
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Gestión de Crédito
      </motion.h2>

      <Row className="g-4 justify-content-center">
        {/* ---- Tarjeta Crédito ---- */}
        <Col md={10} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="tarjeta-main shadow-sm border border-secondary-subtle rounded-4">
              <Card.Body>
                <h4 className="text-success fw-bold mb-3">
                  <FaFileInvoiceDollar className="me-2" />
                  Tu Crédito
                </h4>
                {credito ? (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Límite:</span>
                      <strong>${credito.limite}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Saldo disponible:</span>
                      <strong>${credito.saldo}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Deuda actual:</span>
                      <strong>
                        ${(credito.limite - credito.saldo).toFixed(2)}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Estado:</span>
                      <strong>{credito.estado_nombre}</strong>
                    </div>
                    <div className="text-end mt-3">
                      <Button variant="outline-success" disabled>
                        Crédito Activo
                      </Button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSolicitar}>
                    <label className="fw-semibold mb-2">
                      Monto solicitado:
                    </label>
                    <input
                      type="number"
                      className="form-control mb-3"
                      placeholder="Ingrese monto"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      required
                    />
                    <div className="text-end">
                      <Button
                        type="submit"
                        disabled={enviando}
                        variant="success"
                      >
                        {enviando ? (
                          <>
                            <Spinner size="sm" animation="border" /> Enviando...
                          </>
                        ) : (
                          "Solicitar crédito"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {/* ---- Mostrar solo si NO tiene crédito activo ---- */}
        {!credito && (
          <Col md={5}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="tarjeta-historial border border-secondary-subtle shadow-sm rounded-4">
                <Card.Header className="bg-gradient text-white fw-bold bg-success">
                  <FaHistory className="me-2" /> Historial de Solicitudes
                </Card.Header>
                <Card.Body>
                  {solicitudes.length === 0 ? (
                    <p className="text-muted text-center">
                      No tienes solicitudes registradas.
                    </p>
                  ) : (
                    solicitudes.slice(0, 5).map((s) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={s.id}
                        className="solicitud-card"
                        onClick={() => abrirModal(s)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">
                            ${s.monto_solicitado}
                          </span>
                          <span
                            className={`badge ${
                              s.estado_nombre === "Aprobado"
                                ? "bg-success"
                                : s.estado_nombre === "Rechazado"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {s.estado_nombre}
                          </span>
                        </div>
                        <small className="text-muted">
                          {new Date(s.fecha_solicitud).toLocaleDateString()}
                        </small>
                      </motion.div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        )}

        {/* ---- Auditorías ---- */}
        <Col md={5}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="tarjeta-historial border border-secondary-subtle shadow-sm rounded-4">
              <Card.Header className="bg-success text-white fw-bold">
                🧾 Auditorías del Crédito
              </Card.Header>
              <Card.Body>
                {auditorias.length === 0 ? (
                  <p className="text-muted text-center">
                    No hay auditorías registradas.
                  </p>
                ) : (
                  auditorias.slice(0, 5).map((a) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={a.id}
                      className="auditoria-card"
                      onClick={() => abrirModal(a)}
                    >
                      <div className="d-flex justify-content-between">
                        <span>{a.accion}</span>
                        <FaEye className="text-secondary" />
                      </div>
                      <small className="text-muted">
                        {new Date(a.fecha).toLocaleDateString()}
                      </small>
                    </motion.div>
                  ))
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* ---- Modal ---- */}
      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2 text-success"></i>Detalles
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalleSeleccionado ? (
            <div className="text-muted">
              {/* Crédito #X */}
              {detalleSeleccionado.credito && (
                <p>
                  <strong>Crédito:</strong> {detalleSeleccionado.credito}
                </p>
              )}

              {/* Fecha formateada */}
              {detalleSeleccionado.fecha && (
                <p>
                  <strong>Fecha:</strong> {detalleSeleccionado.fecha}
                </p>
              )}

              {/* Acción */}
              {detalleSeleccionado.accion && (
                <p>
                  <strong>Acción:</strong> {detalleSeleccionado.accion}
                </p>
              )}

              {/* Detalle */}
              {detalleSeleccionado.detalle && (
                <p>
                  <strong>Detalle:</strong> {detalleSeleccionado.detalle}
                </p>
              )}

              {/* Usuario (solo nombre) */}
              {detalleSeleccionado.usuario_nombre && (
                <p>
                  <strong>Usuario:</strong> {detalleSeleccionado.usuario_nombre}
                </p>
              )}
            </div>
          ) : (
            <p>No hay información disponible.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
