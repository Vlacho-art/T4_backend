// Se importan módulos necesarios para la aplicación
import cors from "cors";
import morgan from "morgan";
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
  : [
      "http://localhost:5173", "https://t4-react.vercel.app"
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};


// Se aplica CORS para permitir solicitudes desde otros orígenes
app.use(cors(corsOptions));
// Se importa morgan para registrar solicitudes HTTP en la consola
app.use(morgan('dev'));
// Se parsean datos JSON en el cuerpo de las solicitudes
app.use(express.json());
// Se parsean datos URL-encoded en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true }));

// Ruta base para comprobar que el backend está activo
app.get("/", )
// Se registran rutas de autenticación y APIs bajo el prefijo /api
app.use("/api", authRoutes);
app.use("/api", apiRoutes);
app.use("/api", errorRoutes);

// Middleware que maneja todas las rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
