// jest.env.setup.cjs
const path = require('node:path');
const dotenv = require('dotenv');

// Marca entorno de test (por si tu app hace ramas por NODE_ENV)
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const envPath =
    process.env.DOTENV_CONFIG_PATH
    || (process.env.NODE_ENV === 'test' ? '.env.test' : '.env');

console.log(`Cargando variables de entorno desde ${envPath}`);
dotenv.config({ path: path.resolve(process.cwd(), envPath) });
