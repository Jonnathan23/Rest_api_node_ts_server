import type { Express } from 'express';
import { CorsConfig, DatabaseConnection, envs } from '../config';
import { Server } from '../server';
import router from '../routes';


export interface ServerTest {
    app: Express;
    db: DatabaseConnection;
}

export class TestSetup {

    private static serverTest: ServerTest | null = null;
    private static inCreationProcess: Promise<ServerTest> | null = null;


    private constructor() { }

    public static async getInstances(): Promise<ServerTest> {

        // CASO 1: Ya está creado. Devolverlo.
        if (TestSetup.serverTest) {
            return Promise.resolve(TestSetup.serverTest);
        }

        // CASO 2: Se está creando. Devolver la promesa existente.
        if (TestSetup.inCreationProcess) {
            return TestSetup.inCreationProcess;
        }

        // CASO 3: Primera vez. Crearlo.
        TestSetup.inCreationProcess = TestSetup.buildTestApp().then(newServerTest => {
            TestSetup.serverTest = newServerTest;      // Guardar el resultado
            TestSetup.inCreationProcess = null;  // Limpiar la promesa en curso
            return newServerTest;
        }).catch(err => {
            TestSetup.inCreationProcess = null; // Limpiar en error
            throw err;
        });

        return TestSetup.inCreationProcess;
    }

    /**
     * Lógica de construcción (privada)
     */
    private static async buildTestApp(): Promise<ServerTest> {
        console.log('[TestSetup] Creando instancia de App y BD por primera vez...');

        // 1. Conectar a la BD
        const urlDatabase = envs.DATABASE_URL;
        const db = new DatabaseConnection({ ulrDatabase: urlDatabase, logging: false });
        await db.connect(true);

        // 2. Configurar CORS (forzando 'test')
        const corsOptions = {
            FRONTEND_URL: envs.FRONTEND_URL,
            argv_2: envs.ARGV_2,
            argv_3: envs.ARGV_3,
            SWAGGER_URL: envs.SWAGGER_URL,
            NODE_ENV: 'test', // fuerza que NO monte /docs en tests
        };
        const corsConfig = new CorsConfig(corsOptions).corsOptions;

        // 3. Crear el servidor (sin 'listen')
        const server = new Server({ port: 0, router, corsConfig });

        console.log('[TestSetup] Instancia creada con éxito.');
        const newServerTest: ServerTest = { app: server.express, db };
        return newServerTest;
    }

    /**
     * Método estático para el teardown global.
     */
    public static async close(): Promise<void> {
        if (TestSetup.serverTest && TestSetup.serverTest.db) {
            await TestSetup.serverTest.db.disconnect();
            TestSetup.serverTest = null;
        } else if (TestSetup.inCreationProcess) {
            // Caso raro: se pide cerrar mientras se está creando
            const inst = await TestSetup.inCreationProcess;
            await inst.db.disconnect();
            TestSetup.serverTest = null;
        }
    }
}