import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Spinner,
  Badge,
  InputGroup,
  Form,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  obtenerReservasPendientesHoy,
  confirmarReservaConCodigo,
} from "../../services/meseroService";
import "../../styles/reservas.css";

export default function ReservasMesero() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [codigoInput, setCodigoInput] = useState("");
  const [verCodigo, setVerCodigo] = useState(false); // ⬅ ojito
  const token = localStorage.getItem("token");

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const data = await obtenerReservasPendientesHoy(token);
      setReservas(data);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
    const interval = setInterval(fetchReservas, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleConfirmar = async () => {
    if (!codigoInput.trim()) {
      Swal.fire("Atención", "Ingresá el código de confirmación", "warning");
      return;
    }
    try {
      await confirmarReservaConCodigo(codigoInput.trim().toUpperCase());
      Swal.fire("Reserva confirmada", "", "success");
      setCodigoInput("");
      setModalData(null);
      fetchReservas();
    } catch (err) {
      Swal.fire("❌ Código inválido o ya confirmado", "", "error");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="warning" />
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-center">Reservas Pendientes - Mesero</h2>

      {reservas.length === 0 ? (
        <p className="text-center text-muted">
          No hay reservas pendientes para hoy a partir de ahora.
        </p>
      ) : (
        <div className="row g-3">
          {reservas.map((r) => (
            <div key={r.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 rounded-4 shadow hover-card">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark fs-5">
                        Mesa {r.mesa.numero}
                      </span>
                      <Badge bg="warning" text="dark">
                        Pendiente
                      </Badge>
                    </div>
                    <div className="small text-muted">
                      <div>👤 {r.cliente_nombre}</div>
                      <div>
                        📅 {r.fecha} - 🕒 {r.hora_inicio}
                      </div>
                      <div>👥 {r.numero_personas} personas</div>
                      {r.notas && <div>📝 {r.notas}</div>}
                    </div>
                  </div>
                  <div className="mt-3 d-flex justify-content-between">
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => setModalData(r)}
                    >
                      Confirmacion
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal código + confirmar */}
      <Modal show={!!modalData} onHide={() => setModalData(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Confirmar Reserva - Mesa {modalData?.mesa.numero}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalData && (
            <>
              <p>
                <strong>Código de confirmación:</strong>
              </p>
              <InputGroup className="mb-3">
                <Form.Control
                  type={verCodigo ? "text" : "password"}
                  value={modalData.codigo_confirmacion}
                  readOnly
                  className="text-uppercase text-center fw-bold"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setVerCodigo(!verCodigo)}
                >
                  {verCodigo ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>

              <hr />

              <p>
                <strong>Ingresá el código para confirmar:</strong>
              </p>
              <input
                type="text"
                className="form-control text-uppercase"
                placeholder="ABC123"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalData(null)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleConfirmar}>
            Confirmar Reserva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
