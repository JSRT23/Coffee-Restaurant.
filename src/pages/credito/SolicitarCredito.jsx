import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { creditoAPI } from "../../services/creditoService";

export default function SolicitarCredito({ onSolicitar, ultimaSolicitud }) {
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(false);
  const [diasRestantes, setDiasRestantes] = useState(0);

  useEffect(() => {
    if (!ultimaSolicitud || ultimaSolicitud.estado_nombre !== "Rechazado")
      return;
    const fechaRechazo = new Date(ultimaSolicitud.fecha_respuesta);
    const ahora = new Date();
    const diffMs =
      fechaRechazo.getTime() + 15 * 24 * 60 * 60 * 1000 - ahora.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    setDiasRestantes(diffDias > 0 ? diffDias : 0);
  }, [ultimaSolicitud]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { monto_solicitado: parseFloat(monto) };

    try {
      await creditoAPI.solicitudes.crear(payload);
      Swal.fire({
        icon: "success",
        title: "¡Solicitud enviada!",
        text: "Tu solicitud está en revisión. Te avisaremos cuando sea evaluada.",
        confirmButtonColor: "#0d6efd",
      });
      onSolicitar();
      setMonto("");
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data).flat().join(" / ")
        : "Error al enviar solicitud";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  if (diasRestantes > 0) {
    return (
      <Alert variant="warning" className="text-center">
        ⏳ Tu última solicitud fue rechazada. Podés volver a intentarlo en{" "}
        <strong>{diasRestantes} días</strong>.
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: "500px" }}>
      <Card.Header className="bg-primary text-white fw-bold">
        Solicitar Crédito
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Monto solicitado:</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              placeholder="Ingrese el monto que desea solicitar"
            />
          </Form.Group>
          <div className="text-end">
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" /> Enviando...
                </>
              ) : (
                "Solicitar"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
