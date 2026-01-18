import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomeMesero() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Realizar Pedido",
      description:
        "Crea un nuevo pedido desde cero, selecciona productos y confirma la orden.",
      emoji: "🍔",
      btnText: "Ir a crear →",
      color: "#f8b400",
      route: "/mesero/pedidos/nuevo",
      img: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg",
    },
    {
      title: "Modificar Pedidos",
      description:
        "Consulta los pedidos del día y actualiza su estado según su progreso.",
      emoji: "📋",
      btnText: "Ver pedidos →",
      color: "#0d6efd",
      route: "/mesero/pedidos/hoy",
      img: "https://cdn.pixabay.com/photo/2017/02/05/17/54/coffee-2047963_960_720.jpg",
    },
  ];

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
        padding: "50px 0",
      }}
    >
      <div className="container">
        <div className="row g-4 justify-content-center">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="col-12 col-md-6 col-lg-5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="card border-0 shadow-lg h-100 overflow-hidden"
                style={{
                  borderRadius: "1.5rem",
                  transition: "all 0.4s ease",
                  cursor: "pointer",
                }}
                onClick={() => navigate(card.route)}
              >
                {/* Imagen */}
                <div className="position-relative" style={{ height: "220px" }}>
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      filter: "brightness(0.9)",
                      transition: "all 0.4s ease",
                    }}
                  />
                  <motion.div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: `linear-gradient(135deg, ${card.color}33, #00000022)`,
                      opacity: 0,
                    }}
                    whileHover={{ opacity: 0.25 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Contenido */}
                <div className="card-body text-center p-4">
                  <div
                    className="display-5 mb-3"
                    style={{ transition: "transform 0.3s ease" }}
                  >
                    {card.emoji}
                  </div>
                  <h4 className="fw-bold mb-3 text-dark">{card.title}</h4>
                  <p className="text-muted mb-4">{card.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn text-white fw-semibold px-4 py-2"
                    style={{
                      backgroundColor: card.color,
                      borderRadius: "30px",
                      border: "none",
                    }}
                  >
                    {card.btnText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
