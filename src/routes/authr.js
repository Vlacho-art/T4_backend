import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  updateUser
} from "../controllers/authc.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Se registra un nuevo usuario
router.post("/api/users", createUser);
// Se autentica un usuario y se devuelve un token JWT
router.post("/api/login", loginUser);

// Se obtiene el perfil del usuario autenticado
router.get("/api/users", authenticateToken, getUsers);
// Se obtienen los datos de un usuario específico (solo el usuario mismo)
router.get("/api/users/:id", authenticateToken, getUser);
// Se actualizan los datos de un usuario (solo el usuario mismo)
router.put("/api/users/:id", authenticateToken, updateUser);
// Se elimina la cuenta de un usuario (solo el usuario mismo)
router.delete("/api/users/:id", authenticateToken, deleteUser);

export default router;