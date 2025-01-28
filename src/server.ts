import swaggerUI from 'swagger-ui-express'
import swaggerSpec, { swaggerUIOptions } from './config/swagger';
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import express from "express";
import router from "./routes";
import db from "./config/db";
import morgan from 'morgan';

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.blue.bold('Conexion exitosa a la BD'))
    } catch (error) {
        console.log(error)    
        console.log(colors.red.bold('Error al conectar a la BD'))
    }
}

// Express' instance
connectDB()
const server = express()

// CORS
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.FRONTEND_URL || origin === undefined) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

server.use(cors(corsOptions))

// Read forms' data
server.use(express.json())
server.use(morgan('dev'))
server.use('/api/products', router)


//Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerUIOptions))


export default server