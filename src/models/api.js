import mongoose from "mongoose";

// Se crea esquema para la colección de APIs
const apiSchema = new mongoose.Schema({
  // Referencia al usuario dueño del registro (relación con tabla User)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Nombre del elemento de la API
  name: { type: String, required: true },
  // Estado del elemento: Alive (vivo), Dead (muerto) o Unknown (desconocido)
  status: {
    type: String,
    enum: ["Alive", "Dead", "Unknown"],
    default: "Unknown",
  },
  // Especie o tipo del elemento
  species: {
    type: String,
    enum: [
      "Human",
      "Alien",
      "Robot",
      "Mythological Creature",
      "Animal",
      "Disease",
      "Unknown",
    ],
    default: "Unknown",
  },
  // URL de imagen del elemento
  image: { type: String },
}, { timestamps: true });

// Se crea y se exporta el modelo API basado en el esquema
export default mongoose.model("API", apiSchema);