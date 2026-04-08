// Se importan módulos necesarios para la aplicación
import cors from "cors";
import express from "express";
import apiRoutes from "./routes/apir.js";
import authRoutes from "./routes/authr.js";
import errorRoutes from "./routes/errorr.js";

// Se crea instancia de aplicación Express
const app = express();

// Se configuran opciones de CORS (Cross-Origin Resource Sharing)
const rawCorsOrigin = process.env.CORS_ORIGIN;

const allowedOrigins = rawCorsOrigin
  ? rawCorsOrigin.trim().startsWith("[")
    ? JSON.parse(rawCorsOrigin)
    : rawCorsOrigin.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "https://t4-react-ue8d.vercel.app"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Se aplica CORS para permitir solicitudes desde otros orígenes
app.use(cors(corsOptions));
// Se parsean datos JSON en el cuerpo de las solicitudes
app.use(express.json());
// Se parsean datos URL-encoded en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true }));

// Se registran rutas de autenticación (login, registro)
app.use("/", authRoutes);
// Se registran rutas de API (crear, obtener, actualizar, eliminar)
app.use("/", apiRoutes);
// Se registran rutas de manejo de errores
app.use("/", errorRoutes);

// Middleware que maneja todas las rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
