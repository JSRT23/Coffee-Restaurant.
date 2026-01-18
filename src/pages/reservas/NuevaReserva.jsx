import { useEffect, useState } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import {
  mesasDisponibles,
  listarUbicaciones,
  crearReserva,
  listarMisReservas,
} from "../../services/reservasService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MIN_DATE, MAX_DATE } from "../../utils/dateLimits";
import Swal from "sweetalert2";
import "../../styles/reservas.css";

export default function NuevaReserva() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState(1);
  const [comensales, setComensales] = useState(2);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [ubicacionId, setUbicacionId] = useState("");
  const [ubicaciones, setUbicaciones] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [misReservas, setMisReservas] = useState([]);

  // Modal estados
  const [showModal, setShowModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [verCodigo, setVerCodigo] = useState(false); // ⬅ ojito

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const ubi = await listarUbicaciones();
        setUbicaciones(ubi);

        const res = await listarMisReservas();
        const pendientes = res.filter(
          (r) => r?.estado?.nombre?.trim().toLowerCase() === "pendiente"
        );
        setMisReservas(pendientes);
      } catch (err) {
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (step !== 2 || !fecha || !hora) return;
    setLoading(true);
    mesasDisponibles({
      fecha,
      hora_inicio: hora,
      numero_personas: comensales,
      ubicacion_id: ubicacionId,
    })
      .then(setMesas)
      .finally(() => setLoading(false));
  }, [step, fecha, hora, comensales, ubicacionId]);

  const handleReservar = async () => {
    if (!selectedMesa)
      return Swal.fire("Atención", "Selecciona una mesa", "warning");

    try {
      await crearReserva({
        mesa: selectedMesa,
        fecha,
        hora_inicio: hora,
        numero_personas: comensales,
        estado: 1,
        notas,
      });
      await Swal.fire("¡Listo!", "Reserva creada con éxito", "success");
      nav("/reservas");
    } catch (err) {
      Swal.fire("Error", "No se pudo crear la reserva", "error");
    }
  };

  /* ---------- PASO 1 ---------- */
  if (step === 1)
    return (
      <>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4 text-center">
                    <i className="bi bi-calendar-plus me-2"></i>Hacer Reserva
                  </h4>

                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-person-fill me-1"></i>Cantidad de
                      personas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={comensales}
                      onChange={(e) => setComensales(Number(e.target.value))}
                      className="form-control"
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        if (comensales < 1 || comensales > 20)
                          return Swal.fire(
                            "Atención",
                            "Elige entre 1 y 20 comensales",
                            "warning"
                          );
                        setStep(2);
                      }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- MIS RESERVAS ---------- */}
        <div className="container mt-5 mb-5">
          <h4 className="text-center text-secondary mb-4 fw-bold">
            <i className="bi bi-clock-history me-2"></i>Mis Reservas Pendientes
          </h4>

          <div className="row g-4 justify-content-center">
            {misReservas.length === 0 && (
              <div className="text-center text-muted py-4">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                No tienes reservas pendientes
              </div>
            )}

            {misReservas.map((r) => (
              <div key={r.id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="reserva-card shadow-sm rounded-4 p-3 animate-hover">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                      {r.estado.nombre}
                    </span>
                    <i className="bi bi-calendar-event text-success fs-5"></i>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">
                    {r.fecha}
                    <br />
                    <small className="text-muted">{r.hora_inicio}</small>
                  </h5>

                  <p className="mb-1 text-muted small">
                    <i className="bi bi-geo-alt me-1"></i>
                    {r.mesa.ubicacion.nombre}
                  </p>
                  <p className="mb-1 text-muted small">
                    <i className="bi bi-person me-1"></i>
                    {r.numero_personas} personas
                  </p>

                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">
                      Mesa <strong>{r.mesa.numero}</strong>
                    </span>
                    <button
                      className="btn btn-sm btn-outline-success rounded-pill"
                      onClick={() => {
                        setReservaSeleccionada(r);
                        setShowModal(true);
                      }}
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 MODAL DETALLES + CÓDIGO */}
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setVerCodigo(false);
          }}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-info-circle me-2 text-success"></i>Detalles de
              la Reserva
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reservaSeleccionada && (
              <div className="text-muted">
                <p>
                  <strong>Mesa:</strong> {reservaSeleccionada.mesa.numero}
                </p>
                <p>
                  <strong>Ubicación:</strong>{" "}
                  {reservaSeleccionada.mesa.ubicacion.nombre}
                </p>
                <p>
                  <strong>Personas:</strong>{" "}
                  {reservaSeleccionada.numero_personas}
                </p>
                <p>
                  <strong>Fecha:</strong> {reservaSeleccionada.fecha}
                </p>
                <p>
                  <strong>Hora:</strong> {reservaSeleccionada.hora_inicio}
                </p>
                <p>
                  <strong>Notas:</strong>{" "}
                  {reservaSeleccionada.notas || "Sin notas"}
                </p>
                <p>
                  <strong>Fecha de creación:</strong>{" "}
                  {new Date(reservaSeleccionada.creada_en).toLocaleString(
                    "es-ES"
                  )}
                </p>

                {/* 🔐 Código de confirmación */}
                <hr />
                <p className="mb-1">
                  <strong>Código de confirmación:</strong>
                </p>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type={verCodigo ? "text" : "password"}
                    className="form-control text-uppercase text-center fw-bold"
                    value={reservaSeleccionada.codigo_confirmacion || ""}
                    readOnly
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setVerCodigo(!verCodigo)}
                  >
                    {verCodigo ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                </div>
                <small className="text-muted">
                  Mostrá este código al mesero para confirmar tu reserva.
                </small>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setVerCodigo(false);
              }}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );

  /* ---------- PASO 2 ---------- */
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow">
            <div className="card-body p-4">
              <h4 className="card-title mb-4 text-center">
                <i className="bi bi-calendar-check me-2"></i>Completa tu reserva
              </h4>

              {/* Campos fecha/hora */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    min={MIN_DATE}
                    max={MAX_DATE}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Ubicación (opcional)</label>
                  <select
                    value={ubicacionId}
                    onChange={(e) => setUbicacionId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Cualquiera</option>
                    {ubicaciones.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Notas</label>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="form-control"
                  rows={3}
                  placeholder="Ej.: Mesa cerca de la ventana"
                />
              </div>

              {loading && (
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  <span>Buscando mesas…</span>
                </div>
              )}

              {!loading && fecha && hora && mesas.length === 0 && (
                <div className="alert alert-warning d-flex align-items-center mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  No hay mesas disponibles para {comensales} persona(s) el{" "}
                  {fecha} a las {hora}.
                </div>
              )}

              <div className="row g-3 mb-3">
                <p className="text-muted">Mesas Disponibles</p>
                {mesas.map((m) => (
                  <div className="col-6 col-md-3" key={m.id}>
                    <button
                      className={`btn w-100 h-100 d-flex flex-column justify-content-center align-items-center ${
                        selectedMesa === m.id
                          ? "btn-success text-white"
                          : "btn-outline-success"
                      }`}
                      onClick={() => {
                        Swal.fire({
                          icon: "warning",
                          title: "Importante",
                          text: "Recordar que si se va a realizar una reserva leer bien las políticas del restaurante.",
                          confirmButtonColor: "#198754",
                        });
                        setSelectedMesa(m.id);
                      }}
                    >
                      <div className="fw-bold">Mesa {m.numero}</div>
                      <small className="text-muted">
                        {m.capacidad} pax · {m.ubicacion.nombre}
                      </small>
                    </button>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setStep(1)}
                >
                  <i className="bi bi-arrow-left me-1"></i>Volver
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleReservar}
                  disabled={!selectedMesa}
                >
                  <i className="bi bi-check-circle me-1"></i>Confirmar reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
