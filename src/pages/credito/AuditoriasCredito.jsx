import React, { useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { creditoAPI } from "../../services/creditoService";

export default function AuditoriasCredito({ creditoId }) {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    creditoAPI
      .auditorias(creditoId)
      .then((res) => setAuditorias(res.data))
      .finally(() => setLoading(false));
  }, [creditoId]);

  if (loading)
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-info text-white fw-bold">
        Historial del Crédito
      </Card.Header>
      <Card.Body>
        {auditorias.length === 0 ? (
          <p className="text-muted">No hay movimientos aún.</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Acción</th>
                <th>Detalle</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {auditorias.map((a) => (
                <tr key={a.id}>
                  <td>{a.accion}</td>
                  <td>{a.detalle}</td>
                  <td>{new Date(a.fecha).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
