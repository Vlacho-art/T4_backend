import jwt from "jsonwebtoken";

/**
 * Middleware que verifica si existe un token JWT válido en el header.
 * Si es válido, extrae los datos del usuario y continúa.
 * Si no es válido, rechaza la solicitud.
 */
export const authenticateToken = (req, res, next) => {
  // Se obtiene el header Authorization (puede estar en minúsculas o mayúsculas)
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Se verifica que el header exista y comience con "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // Se extrae el token eliminando la palabra "Bearer "
  const token = authHeader.split(" ")[1];

  // Se verifica que el token sea válido usando la clave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // Si hay error, el token es inválido o ha expirado
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    // Se guardan los datos del usuario decodificados en la solicitud
    req.user = decoded;
    // Se continúa con el siguiente middleware/controlador
    next();
  });
};

/**
 * Se genera un nuevo token JWT con los datos del usuario.
 * El token expira en 7 días.
 */
export const generateToken = (payload) => {
  // Se verifica que existe la clave secreta para firmar el token
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no definido en .env");
  }

  // Se firma el token con los datos del usuario y la clave secreta
  // El token expira en 7 días 
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};
