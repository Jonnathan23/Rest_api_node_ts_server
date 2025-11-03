import { Sequelize } from "sequelize-typescript";
import colors from 'colors'

interface Options {
    ulrDatabase: string
    logging?: boolean
}

export class DatabaseConnection {
    
    private readonly db: Sequelize

    constructor(options: Options) {
        const { ulrDatabase, logging = false } = options        

        const db = new Sequelize(ulrDatabase, {
            models: [__dirname + '/../models/**/*'],
            logging: logging
        })

        this.db = db
    }

    async connect() {
        try {
            await this.db.authenticate()
            this.db.sync()
            console.log(colors.blue.bold('Conexion exitosa a la BD'))
        } catch (error) {
            console.log(colors.red.bold('Error al conectar a la BD'))
            console.log(error)
        }
    }

    getConnection() {
        return this.db
    }
    
}