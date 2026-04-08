import { Router } from "express";
import {
  createApi,
  deleteApi,
  getApiById,
  getApis,
  updateApi
} from "../controllers/apic.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Se crea una nueva API
router.post("/", authenticateToken, createApi);
// Se obtienen todas las APIs del usuario autenticado
router.get("/", authenticateToken, getApis);
// Se obtiene una API específica por su ID
router.get("/:id", authenticateToken, getApiById);
// Se actualiza una API existente
router.put("/:id", authenticateToken, updateApi);
// Se elimina una API
router.delete("/:id", authenticateToken, deleteApi);

export default router;