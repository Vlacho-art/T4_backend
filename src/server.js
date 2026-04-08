// Se importan configuraciones de variables de entorno (.env)
import 'dotenv/config';
// Se importa la aplicación Express configurada
import app from './app.js';
// Se importa la función de conexión a la base de datos
import { connectDB } from './config/database.js';

// Se obtiene el puerto del archivo .env, o se usa 3000 por defecto
const { PORT = 3000 } = process.env;

// Se intenta conectar a MongoDB primero
connectDB()
  // Si la conexión es exitosa, se inicia el servidor Express
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  // Si hay error en la conexión, se muestra error y se termina el proceso
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });