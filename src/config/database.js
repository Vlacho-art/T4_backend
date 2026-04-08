import dns from 'dns';
import mongoose from 'mongoose';

// Se configuran servidores DNS públicos (Google y Cloudflare)
// Esto es necesario para resolver correctamente los servidores SRV de MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Se obtiene la URI de conexión a MongoDB desde variables de entorno
const { MONGO_URI } = process.env;

/**
 * Se conecta la aplicación a la base de datos MongoDB.
 * Se valida que la URI esté configurada antes de intentar la conexión.
 */
export async function connectDB() {
  // Se verifica que exista la URI de conexión
  if (!MONGO_URI) {
    throw new Error('MONGO_URI no definido en .env');
  }

  // Se realiza la conexión a MongoDB usando Mongoose
  await mongoose.connect(MONGO_URI);
  console.log('✅ Conectado a MongoDB Atlas');
}