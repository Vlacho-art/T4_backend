import mongoose from "mongoose";

// Se crea esquema para la colección de usuarios
const userSchema = new mongoose.Schema(
  {
    // Campo: nombre de usuario
    username: {
      type: String,
      required: true,
      trim: true
    },
    // Campo: correo electrónico
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    // Campo: contraseña del usuario (almacenada de forma cifrada)
    password: {
      type: String,
      required: true
    }
  },
  {
    // Se agregan automáticamente campos createdAt y updatedAt
    timestamps: true
  }
);

// Se crea y se exporta el modelo User basado en el esquema
export default mongoose.model("User", userSchema);