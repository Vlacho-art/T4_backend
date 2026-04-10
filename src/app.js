import cors from "cors";
import express from "express";
import apiRoutes from "./routes/apir.js";
import authRoutes from "./routes/authr.js";
import errorRoutes from "./routes/errorr.js";

const app = express();

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://t4-react.vercel.app",
];

const normalizeOrigin = (origin) => origin.trim().replace(/\/$/, "");

const parseAllowedOrigins = (rawValue) => {
  if (!rawValue) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  try {
    const parsedOrigins = rawValue.trim().startsWith("[")
      ? JSON.parse(rawValue)
      : rawValue.split(",");

    return parsedOrigins
      .map((origin) => normalizeOrigin(String(origin)))
      .filter(Boolean);
  } catch (error) {
    console.error("Error parsing CORS_ORIGIN, using defaults:", error.message);
    return DEFAULT_ALLOWED_ORIGINS;
  }
};

const allowedOrigins = parseAllowedOrigins(process.env.CORS_ORIGIN);

const buildCorsOptions = (origin) => ({
  origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
});

const corsOptionsDelegate = (req, callback) => {
  const requestOrigin = req.header("Origin");

  if (!requestOrigin) {
    return callback(null, buildCorsOptions(true));
  }

  const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
  let isPreviewDeployment = false;

  try {
    isPreviewDeployment = /\.vercel\.app$/i.test(new URL(requestOrigin).hostname);
  } catch (error) {
    isPreviewDeployment = false;
  }

  const isAllowed =
    allowedOrigins.includes(normalizedRequestOrigin) || isPreviewDeployment;

  return callback(null, buildCorsOptions(isAllowed));
};

app.use(cors(corsOptionsDelegate));
app.options("/{*path}", cors(corsOptionsDelegate));

console.log("Allowed origins:", allowedOrigins);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Backend activo",
    docs: "/api/health",
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "API activa",
    endpoints: ["/api/health", "/api/login", "/api/users", "/api/errors"],
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "t4_backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", authRoutes);
app.use("/api", apiRoutes);
app.use("/api", errorRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
