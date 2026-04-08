import { Router } from "express";
import {
  createError,
  deleteError,
  getErrors,
  updateError
} from "../controllers/errorc.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Se crea un nuevo registro de error
router.post("/errors", authenticateToken, createError);
// Se obtienen todos los registros de error del usuario autenticado
router.get("/errors", authenticateToken, getErrors);
// Se actualiza un registro de error existente
router.put("/errors/:id", authenticateToken, updateError);
// Se elimina un registro de error
router.delete("/errors/:id", authenticateToken, deleteError);

export default router;