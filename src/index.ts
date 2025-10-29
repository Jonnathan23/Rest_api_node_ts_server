import { CorsConfig, DatabaseConnection, envs } from './config'
import { Server } from './server'
import router from './routes'

(() => {
    main()
})()


async function main() {
    //Connect DB
    const urlDatabase = envs.DATABASE_URL

    const db = new DatabaseConnection({ ulrDatabase: urlDatabase, logging: true })
    await db.connect()

    //Config CORS
    const corsOptions = {
        FRONTEND_URL: envs.FRONTEND_URL,
        argv_2: envs.ARGV_2,
        argv_3: envs.ARGV_3,
        SWAGGER_URL: envs.SWAGGER_URL,
        NODE_ENV: envs.NODE_ENV
    }

    const corsConfig = new CorsConfig(corsOptions).corsOptions

    //Start server
    new Server({ port: envs.PORT, router: router, corsConfig }).starApp()
}

