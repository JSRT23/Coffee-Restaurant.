import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { FaSearch, FaMoneyBillWave } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  listarCreditosMesero,
  registrarAbonoMesero,
} from "../../services/meseroService";
import "../../styles/creditosMesero.css"; // ⬅ animaciones aquí

export default function CreditosMesero() {
  const [creditos, setCreditos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showAbono, setShowAbono] = useState(false);
  const [monto, setMonto] = useState("");

  const fetchCreditos = async () => {
    try {
      const data = await listarCreditosMesero();
      setCreditos(data);
      setFiltered(data);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar los créditos", "error");
    }
  };

  useEffect(() => {
    fetchCreditos();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      creditos.filter((c) => c.cliente_nombre.toLowerCase().includes(lower))
    );
  }, [search, creditos]);

  const handleAbonar = async () => {
    const valor = parseFloat(monto);
    if (!valor || valor <= 0)
      return Swal.fire("Atención", "Monto inválido", "warning");
    const deuda = parseFloat(selected.limite) - parseFloat(selected.saldo);
    if (valor > deuda)
      return Swal.fire(
        "Atención",
        `El abono no puede superar la deuda ($${deuda.toFixed(2)})`,
        "warning"
      );
    try {
      await registrarAbonoMesero(selected.id, valor, "Abono en caja - mesero");
      Swal.fire(
        "✅ Abono registrado",
        `Se abonaron $${valor.toFixed(2)}`,
        "success"
      );
      setMonto("");
      setShowAbono(false);
      setShowInfo(false);
      fetchCreditos();
    } catch (err) {
      Swal.fire("Error", "No se pudo registrar el abono", "error");
    }
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center fw-bold">Abono a Crédito - Mesero</h3>

      {/* Buscador con lupa */}
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Tarjetas clickeables con animación */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filtered.map((c) => {
          const deuda = parseFloat(c.limite) - parseFloat(c.saldo);
          return (
            <Col key={c.id}>
              <Card
                className="h-100 shadow-sm rounded-4 credito-card"
                onClick={() => {
                  setSelected(c);
                  setShowInfo(true);
                }}
              >
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge
                      bg={
                        c.estado_nombre === "Activo" ? "success" : "secondary"
                      }
                    >
                      {c.estado_nombre}
                    </Badge>
                    <FaMoneyBillWave className="text-success" />
                  </div>

                  <h5 className="mb-1">{c.cliente_nombre}</h5>
                  <p className="mb-1 text-muted">
                    Límite:{" "}
                    <strong>${parseFloat(c.limite).toLocaleString()}</strong>
                  </p>
                  <p className="mb-1 text-muted">
                    Saldo:{" "}
                    <strong>${parseFloat(c.saldo).toLocaleString()}</strong>
                  </p>
                  <p className="mb-3 text-danger fw-bold">
                    Deuda: <strong>${deuda.toLocaleString()}</strong>
                  </p>

                  <Button variant="success" className="mt-auto">
                    Abonar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal Info */}
      <Modal show={showInfo} onHide={() => setShowInfo(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Crédito</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div>
              <p>
                <strong>Cliente:</strong> {selected.cliente_nombre}
              </p>
              <p>
                <strong>Límite:</strong> $
                {parseFloat(selected.limite).toLocaleString()}
              </p>
              <p>
                <strong>Saldo disponible:</strong> $
                {parseFloat(selected.saldo).toLocaleString()}
              </p>
              <p>
                <strong>Deuda actual:</strong> $
                {(
                  parseFloat(selected.limite) - parseFloat(selected.saldo)
                ).toLocaleString()}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge
                  bg={
                    selected.estado_nombre === "Activo"
                      ? "success"
                      : "secondary"
                  }
                >
                  {selected.estado_nombre}
                </Badge>
              </p>
              <p>
                <strong>Fecha inicio:</strong>{" "}
                {new Date(selected.fecha_inicio).toLocaleDateString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfo(false)}>
            Cerrar
          </Button>
          <Button
            variant="success"
            onClick={() => {
              setShowInfo(false);
              setShowAbono(true);
            }}
          >
            Abonar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Abono */}
      <Modal show={showAbono} onHide={() => setShowAbono(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Abono</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div>
              <p className="mb-2">
                Cliente: <strong>{selected.cliente_nombre}</strong>
              </p>
              <p className="mb-2">
                Deuda actual:{" "}
                <strong className="text-danger">
                  $
                  {(
                    parseFloat(selected.limite) - parseFloat(selected.saldo)
                  ).toLocaleString()}
                </strong>
              </p>
              <Form.Group>
                <Form.Label>Monto a abonar</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={(
                    parseFloat(selected.limite) - parseFloat(selected.saldo)
                  ).toFixed(2)}
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAbono(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAbonar}>
            Confirmar abono
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
