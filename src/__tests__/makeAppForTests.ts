import type { Express } from 'express';
import { CorsConfig, DatabaseConnection, envs } from '../config';
import { Server } from '../server';
import router from '../routes';

type Options = {
    connectDB?: boolean;   // por si quieres saltarte BD en tests
    loggingDB?: boolean;   // silenciar logs
};

//export let db: DatabaseConnection;

export async function makeAppForTests(opts: Options = {}): Promise<Express> {
    const { connectDB = true, loggingDB = false } = opts;

    if (connectDB) {
        const urlDatabase = envs.DATABASE_URL;
        const db = new DatabaseConnection({ ulrDatabase: urlDatabase, logging: loggingDB });
        await db.connect(true);
    }

    const corsOptions = {
        FRONTEND_URL: envs.FRONTEND_URL,
        argv_2: envs.ARGV_2,
        argv_3: envs.ARGV_3,
        SWAGGER_URL: envs.SWAGGER_URL,
        NODE_ENV: 'test', // fuerza que NO monte /docs en tests
    };
    const corsConfig = new CorsConfig(corsOptions).corsOptions;

    // 3) Instanciar Server (igual que index.ts) pero sin listen
    const server = new Server({ port: envs.PORT ?? 0, router, corsConfig });

    // 4) Devolver el Express ya construido
    return server.express;
}