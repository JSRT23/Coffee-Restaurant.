import { useEffect, useState } from "react";
import {
  listarPedidos,
  actualizarEstadoPedido,
  getEstados,
} from "../../services/cocinaServives";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FaUtensils, FaClock, FaCheck } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CocinaPage() {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Cargar datos iniciales + refresco automático
  useEffect(() => {
    cargar();
    const intervalo = setInterval(() => {
      cargar();
    }, 15000);
    return () => clearInterval(intervalo);
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);

      const fechaHoy = new Date().toISOString().split("T")[0];

      const [respEstados, respPedidos] = await Promise.all([
        getEstados(),
        listarPedidos({ fecha: fechaHoy }),
      ]);

      console.log("📦 respEstados:", respEstados);
      console.log("📦 respPedidos crudo:", respPedidos);

      // respEstados SI trae {data}
      setEstados(respEstados.data);

      // respPedidos YA ES EL ARRAY → NO tiene .data
      const pedidosFiltrados = respPedidos.filter((p) =>
        ["Pendiente", "En cocina"].includes(p.estado.nombre)
      );

      console.log("🔍 pedidosFiltrados:", pedidosFiltrados);

      pedidosFiltrados.sort((a, b) => a.id - b.id);

      setPedidos(pedidosFiltrados);
    } catch (error) {
      console.error(
        "❌ Error en cargar:",
        error.response?.data || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Error al cargar pedidos",
        text: "Verifica tu conexión o los permisos del usuario.",
        confirmButtonColor: "#a47551",
      });
    } finally {
      setLoading(false);
    }
  };

  const pasarASiguienteEstado = async (pedido) => {
    const actual = pedido.estado.nombre;
    const siguiente =
      actual === "Pendiente"
        ? "En cocina"
        : actual === "En cocina"
        ? "Listo"
        : null;

    if (!siguiente) return;

    const estadoDestino = estados.find((e) => e.nombre === siguiente);
    if (!estadoDestino) return;

    const confirm = await Swal.fire({
      title: `¿Cambiar pedido #${pedido.id} a "${siguiente}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#a47551",
      cancelButtonColor: "#6c757d",
      background: "#fff8e7",
      color: "#4b3a2f",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await actualizarEstadoPedido(pedido.id, estadoDestino.id);
      Swal.fire({
        icon: "success",
        title: `Pedido #${pedido.id} → ${siguiente}`,
        timer: 1500,
        showConfirmButton: false,
        background: "#fff8e7",
        color: "#4b3a2f",
      });
      cargar();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudo cambiar el estado del pedido.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-light min-vh-100 py-5">
      <Container style={{ maxWidth: "1100px" }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-brown">
            🍳 Panel de Cocina – Pedidos en Preparación
          </h2>
          <p className="text-muted">
            Solo se muestran pedidos del <strong>día actual</strong> con estado{" "}
            <strong>Pendiente</strong> o <strong>En cocina</strong>.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-muted">
            No hay pedidos pendientes por preparar.
          </p>
        ) : (
          <Row className="g-4">
            {pedidos.map((p) => (
              <Col md={4} key={p.id}>
                <Card className="shadow-sm border-0 rounded-4 h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0">#{p.id}</h5>
                      <Badge
                        bg={
                          p.estado.nombre === "Pendiente" ? "warning" : "info"
                        }
                        text={
                          p.estado.nombre === "Pendiente" ? "dark" : "light"
                        }
                      >
                        {p.estado.nombre}
                      </Badge>
                    </div>

                    <p className="small mb-1">
                      <FaUtensils /> <strong>Mesa:</strong> {p.mesa || "—"}
                    </p>
                    <p className="small mb-2">
                      <FaClock /> <strong>Cliente:</strong>{" "}
                      {p.cliente_nombre || "—"}
                    </p>

                    <hr className="my-3" />

                    <ul className="small mb-3" style={{ lineHeight: "1.4em" }}>
                      {p.detalles?.length ? (
                        p.detalles.map((d) => (
                          <li key={d.id}>
                            <strong>
                              {d.variante?.nombre_completo ||
                                `${d.variante?.producto_nombre} - ${d.variante?.nombre_variante}`}
                            </strong>{" "}
                            × {d.cantidad}
                          </li>
                        ))
                      ) : (
                        <li className="text-muted">
                          (Sin detalles disponibles)
                        </li>
                      )}
                    </ul>

                    <div className="text-center">
                      <Button
                        variant={
                          p.estado.nombre === "Pendiente"
                            ? "warning"
                            : "success"
                        }
                        className="px-4 fw-semibold"
                        onClick={() => pasarASiguienteEstado(p)}
                        disabled={loading}
                      >
                        {p.estado.nombre === "Pendiente" ? (
                          "Pasar a En cocina"
                        ) : (
                          <>
                            <FaCheck /> Marcar como Listo
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  );
}
