// === config/config.js ===
const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key', // Asegúrate de definir esta variable en el archivo .env
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://Eduardo:Gatosbellos0@paralegal-a.nfevj.mongodb.net/paralegal', // También puedes definir esta variable en el .env
  PORT: process.env.PORT || 5000, // El puerto de tu aplicación
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000', // El origen permitido para CORS
};

module.exports = config;
