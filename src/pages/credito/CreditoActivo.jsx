import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

export default function CreditoActivo({ credito }) {
  const deuda = credito.limite - credito.saldo;
  const porcentaje = ((deuda / credito.limite) * 100).toFixed(1);

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-success text-white fw-bold">
        Crédito Activo
      </Card.Header>
      <Card.Body>
        <p>
          <strong>Límite:</strong> ${credito.limite}
        </p>
        <p>
          <strong>Saldo disponible:</strong> ${credito.saldo}
        </p>
        <p>
          <strong>Deuda:</strong> ${deuda.toFixed(2)}
        </p>
        <p>
          <strong>Estado:</strong> {credito.estado_nombre}
        </p>
        <p>
          <strong>Inicio:</strong>{" "}
          {new Date(credito.fecha_inicio).toLocaleDateString()}
        </p>

        <ProgressBar
          now={porcentaje}
          label={`${porcentaje}% usado`}
          variant={
            porcentaje < 70 ? "success" : porcentaje < 90 ? "warning" : "danger"
          }
        />
      </Card.Body>
    </Card>
  );
}
