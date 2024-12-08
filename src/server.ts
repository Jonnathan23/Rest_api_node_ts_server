import colors from 'colors'
import express from "express";
import router from "./routes";
import db from "./config/db";

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
       // console.log(colors.blue.bold('Conexion exitosa a la BD'))
    } catch (error) {
        //console.log(error)
        console.log(colors.red.bold('Error al conectar a la BD'))
    }
}

// Express' instance
connectDB()
const server = express()

// Read forms' data
server.use(express.json())

server.use('/api/products', router)

server.get('/api', (req, res) => {
    res.json({ msg: 'Desde API' })
})



export default server