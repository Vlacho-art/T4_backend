import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.middleware.js";
import User from "../models/user.js";

// Función para validar contraseña
const validarPassword = (password) => {
  // mínimo 6 caracteres y al menos 1 carácter especial
  const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  return regex.test(password);
};

// Función para validar email
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Se crea un nuevo usuario con validaciones de seguridad
export const createUser = async (req, res) => {
  try {
    // Se desestructuran los datos del cuerpo de la solicitud (username, email, password)
    const { username, email, password } = req.body;

    // Se valida que todos los campos requeridos estén presentes
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Se valida el formato del email
    if (!validarEmail(email)) {
      return res.status(400).json({ message: "El correo no es válido" });
    }

    // Se valida que la contraseña cumpla con requisitos de seguridad
    if (!validarPassword(password)) {
      return res.status(400).json({ message: "La contraseña no cumple con los requisitos" });
    }

    // Se verifica que no exista otro usuario con el mismo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    // Se valida que la contraseña no esté siendo usada por otro usuario
    const allUsers = await User.find();
    for (const user of allUsers) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return res.status(400).json({ message: "No se pudo crear la cuenta. Intenta con otros datos." });
      }
    }

    // Se cifra la contraseña con bcrypt (salt rounds: 6)
    const hashedPassword = await bcrypt.hash(password, 6);
    // Se crea un nuevo documento de usuario
    const newUser = new User({ username, email, password: hashedPassword });
    // Se almacena en la base de datos
    const savedUser = await newUser.save();

    // Se convierte a objeto y se elimina la contraseña antes de retornar
    const userData = savedUser.toObject();
    delete userData.password;

    // Se retorna el usuario creado con código 201 (Created)
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Se autentica un usuario con email y contraseña y se genera un token JWT
export const loginUser = async (req, res) => {
  try {
    // Se desestructuran los datos del cuerpo de la solicitud
    const { email, password } = req.body;

    // Se valida que ambos campos estén presentes
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // Se busca el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Se compara la contraseña ingresada con la almacenada (cifrada)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Se genera un token JWT con datos del usuario
    const token = generateToken({ id: user._id, email: user.email });
    // Se convierte a objeto y se elimina la contraseña
    const userData = user.toObject();
    delete userData.password;

    // Se retorna el token y los datos del usuario
    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Se obtienen los datos del usuario que está autenticado
// Obtener el perfil del usuario autenticado
export const getUsers = async (req, res) => {
  try {
    // Se retornan los datos del usuario autenticado
    // req.user contiene los datos decodificados del token JWT
    // Se busca el usuario por su ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const userData = user.toObject();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Se obtienen los datos de un usuario específico (solo si es el usuario autenticado)
// Obtener un usuario por ID (solo si es el usuario autenticado)
export const getUser = async (req, res) => {
  try {
    // Se valida que el ID en la URL coincida con el usuario autenticado
    // Esto previene que un usuario acceda a datos de otro usuario
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "No tienes permiso para acceder a este usuario" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const userData = user.toObject();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Se actualizan los datos de un usuario (solo el usuario mismo puede actualizar su información)
// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    // Se valida que solo pueda actualizar sus propios datos
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este usuario" });
    }

    // Se previene cambiar el email, permitiendo solo otros campos
    if (req.body.email) {
      return res.status(400).json({ message: "No puedes cambiar tu email" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userData = updatedUser.toObject();
    delete userData.password;

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== ELIMINAR USUARIO =====
// Se elimina la cuenta de un usuario (solo el usuario mismo puede eliminar su propia cuenta)
//  Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    // Se valida que solo pueda eliminar su propia cuenta
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este usuario" });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};