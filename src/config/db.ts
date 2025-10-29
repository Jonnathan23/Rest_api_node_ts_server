import { Sequelize } from "sequelize-typescript";
import colors from 'colors'

interface Options {
    ulrDatabase: string
    logging?: boolean
}

export class DatabaseConnection {

    private readonly ulrDatabase: string;
    private readonly logging: boolean;

    constructor(options: Options) {
        const { ulrDatabase, logging = false } = options
        this.ulrDatabase = ulrDatabase
        this.logging = logging
    }

    async connect() {
        const db = new Sequelize(this.ulrDatabase, {
            models: [__dirname + '/../models/**/*'],
            logging: this.logging
        })

        try {
            await db.authenticate()
            db.sync()
            console.log(colors.blue.bold('Conexion exitosa a la BD'))
        } catch (error) {
            console.log(colors.red.bold('Error al conectar a la BD'))
            console.log(error)
        }
    }
}