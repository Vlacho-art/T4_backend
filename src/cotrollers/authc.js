import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/auth.middleware.js";
import User from "../models/user.js";

// Función para validar contraseña
const validarPassword = (password) => {
  // mínimo 6 caracteres y al menos 1 carácter especial
  const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
  return regex.test(password);
};

// Crear usuario
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Validar contraseña
    if (!validarPassword(password)) {
      return res.status(400).json({ message: "La contraseña no cumple con los requisitos" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    // Validar que la contraseña no esté siendo usada por otro usuario
    const allUsers = await User.find();
    for (const user of allUsers) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return res.status(400).json({ message: "Esta contraseña ya está siendo utilizada por otro usuario" });
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 6);

    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    const userData = savedUser.toObject();
    delete userData.password;

    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id, email: user.email });
    const userData = user.toObject();
    delete userData.password;

    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};