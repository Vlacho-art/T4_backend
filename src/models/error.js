import mongoose from "mongoose";

// Se crea esquema para la colección de registros de errores
const errorSchema = new mongoose.Schema({
  // Referencia al usuario que generó el error (relación con tabla User)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Código del error (ej: "ERR_001", "500", "VALIDATION_ERROR")
  codigo: String,
  // Mensaje descriptivo del error
  mensaje: String,
  // Módulo o componente donde ocurrió el error
  modulo: String,
  // Stack trace del error (ayuda para debugging)
  stack_trace: String,
  // Metadatos adicionales del error
  metadata: {
    // Dirección IP desde donde se generó el error
    ip: String,
    // User Agent del navegador/cliente
    user_agent: String
  },
  // Fecha y hora en que ocurrió el error
  fecha: {
    type: Date,
    default: Date.now
  }
});

// Se crea y se exporta el modelo ErrorLog basado en el esquema
export default mongoose.model("ErrorLog", errorSchema);