import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useCarrito } from "../../context/CarritoContext";

export default function Carrito() {
  const {
    items = [],
    eliminarDelCarrito,
    vaciarCarrito,
    actualizarCantidad,
  } = useCarrito();

  const total = items.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 0),
    0
  );

  return (
    <div className="container py-5 mt-5">
      <h2 className="mb-4 fw-bold text-center">
        <i className="bi bi-cart-check text-warning me-2"></i>
        Tu carrito de compras
      </h2>

      {items.length === 0 ? (
        <div className="text-center my-5">
          <i className="bi bi-cart-x display-1 text-secondary"></i>
          <h4 className="mt-3">Tu carrito está vacío</h4>
          <p className="text-muted">
            Agrega productos desde el menú para comenzar tu pedido.
          </p>
          <Link
            to="/menu"
            className="btn btn-warning mt-3 fw-semibold text-dark px-4 py-2 rounded-pill"
          >
            <i className="bi bi-cup-straw me-2"></i> Ir al Menú
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-warning">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th style={{ width: "150px" }}>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.key}>
                    <td className="fw-semibold">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.imagen}
                          alt={item.nombre_variante || item.producto_nombre}
                          className="rounded"
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div>
                            {item.nombre_variante || item.producto_nombre}
                          </div>
                          <div className="text-muted small">
                            {item.codigo_barra || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>${(item.precio || 0).toLocaleString()}</td>

                    <td>
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-warning fw-bold"
                          onClick={() =>
                            actualizarCantidad(item.key, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center fw-semibold"
                          value={item.cantidad}
                          min={1}
                          max={item.stock || 999}
                          onChange={(e) => {
                            let value = parseInt(e.target.value) || 1;
                            if (value > (item.stock || 999))
                              value = item.stock || 999;
                            actualizarCantidad(item.key, value);
                          }}
                        />
                        <button
                          className="btn btn-outline-warning fw-bold"
                          onClick={() =>
                            actualizarCantidad(
                              item.key,
                              Math.min(item.cantidad + 1, item.stock || 999)
                            )
                          }
                          disabled={item.cantidad >= (item.stock || 999)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </td>

                    <td>
                      $
                      {(
                        (item.precio || 0) * (item.cantidad || 0)
                      ).toLocaleString()}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarDelCarrito(item.key)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-danger fw-semibold"
              onClick={vaciarCarrito}
            >
              <i className="bi bi-x-circle me-2"></i> Vaciar carrito
            </button>

            <div className="text-end">
              <h4 className="fw-bold mb-2">
                Total:{" "}
                <span className="text-warning">${total.toLocaleString()}</span>
              </h4>
              <Link
                to="/confirmar-pedido"
                className="btn btn-warning fw-semibold text-dark px-4 py-2 rounded-pill"
              >
                <i className="bi bi-check2-circle me-2"></i> Confirmar pedido
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
