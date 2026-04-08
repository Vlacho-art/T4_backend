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
router.post("/users", createUser);
// Se autentica un usuario y se devuelve un token JWT
router.post("/login", loginUser);

// Se obtiene el perfil del usuario autenticado
router.get("/users", authenticateToken, getUsers);
// Se obtienen los datos de un usuario específico (solo el usuario mismo)
router.get("/users/:id", authenticateToken, getUser);
// Se actualizan los datos de un usuario (solo el usuario mismo)
router.put("/users/:id", authenticateToken, updateUser);
// Se elimina la cuenta de un usuario (solo el usuario mismo)
router.delete("/users/:id", authenticateToken, deleteUser);

export default router;