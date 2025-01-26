const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000,
  CORS_ORIGINS: [
    'https://wiki-paralegal.netlify.app', 
    'http://localhost:3000',
    'http://localhost:5000'
  ]
};