import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Default values for environment variables
const defaults = {
  NODE_ENV: 'development',
  PORT: 5000,
  MONGODB_URI: 'mongodb://localhost:27017/pantry-to-plate',
  JWT_SECRET: 'your-secret-key-change-in-production',
  JWT_REFRESH_SECRET: 'your-refresh-secret-key-change-in-production',
  JWT_EXPIRES_IN: '1h',
  JWT_REFRESH_EXPIRES_IN: '7d',
  EMAIL_FROM: 'noreply@pantrytoplate.com',
  EMAIL_HOST: 'smtp.mailtrap.io',
  EMAIL_PORT: 2525,
  EMAIL_USERNAME: 'your-username',
  EMAIL_PASSWORD: 'your-password',
  CLIENT_URL: 'http://localhost:3000',
  CORS_ORIGIN: 'http://localhost:3000'
};

// Configuration object with environment variables or defaults
const config = {
  NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
  PORT: parseInt(process.env.PORT || `${defaults.PORT}`, 10),
  MONGODB_URI: process.env.MONGODB_URI || defaults.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || defaults.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || defaults.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || defaults.JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || defaults.JWT_REFRESH_EXPIRES_IN,
  EMAIL_FROM: process.env.EMAIL_FROM || defaults.EMAIL_FROM,
  EMAIL_HOST: process.env.EMAIL_HOST || defaults.EMAIL_HOST,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || `${defaults.EMAIL_PORT}`, 10),
  EMAIL_USERNAME: process.env.EMAIL_USERNAME || defaults.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || defaults.EMAIL_PASSWORD,
  CLIENT_URL: process.env.CLIENT_URL || defaults.CLIENT_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || defaults.CORS_ORIGIN
};

// Validate required configuration
const validateConfig = () => {
  const requiredVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET'
  ];

  // In production, ensure we're not using default secrets
  if (config.NODE_ENV === 'production') {
    if (config.JWT_SECRET === defaults.JWT_SECRET) {
      throw new Error('JWT_SECRET must be set in production');
    }
    if (config.JWT_REFRESH_SECRET === defaults.JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET must be set in production');
    }
  }

  // Check that all required variables are defined
  for (const requiredVar of requiredVars) {
    if (!config[requiredVar as keyof typeof config]) {
      throw new Error(`Required environment variable ${requiredVar} is not set`);
    }
  }
};

// Only validate in production to make development easier
if (config.NODE_ENV === 'production') {
  validateConfig();
}

export default config; 