// Se importan módulos necesarios para la aplicación
import cors from "cors";
import express from "express";
import apiRoutes from "./routes/apir.js";
import authRoutes from "./routes/authr.js";
import errorRoutes from "./routes/errorr.js";

const app = express();

const rawCorsOrigin = process.env.CORS_ORIGIN;

const allowedOrigins = rawCorsOrigin
  ? rawCorsOrigin.trim().startsWith("[")
    ? JSON.parse(rawCorsOrigin)
    : rawCorsOrigin.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "https://t4-react.vercel.app"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],   // ← Agrega esto
  allowedHeaders: ["Content-Type", "Authorization"],       // ← Agrega esto
};

// ✅ CORS debe ir PRIMERO, antes de todo
app.use(cors(corsOptions));

// ✅ Responde explícitamente a todas las peticiones preflight
app.options("*", cors(corsOptions));

// Log para verificar en Render qué origins está cargando
console.log("✅ Allowed origins:", allowedOrigins);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.use("/api", authRoutes);
app.use("/api", apiRoutes);
app.use("/api", errorRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;