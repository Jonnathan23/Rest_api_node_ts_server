import type { Express } from 'express';
import { CorsConfig, DatabaseConnection, envs } from '../config';
import { Server } from '../server';
import router from '../routes';

// Un 'type' para lo que la clase va a almacenar
export interface TestInstances {
    app: Express;
    db: DatabaseConnection;
}

// -----------------------------------------------------------
// TU CLASE SINGLETON
// -----------------------------------------------------------
export class TestSetup {

    // 1. Almacenes estáticos (privados) para la instancia y la promesa
    private static instance: TestInstances | null = null;
    private static setupPromise: Promise<TestInstances> | null = null;

    /**
     * El constructor es privado, por lo que nadie puede hacer 'new TestSetup()'.
     * Esto FUERZA a que se use el método estático .getInstances()
     */
    private constructor() { }

    /**
     * El método estático principal para obtener la app y la DB.
     * Es el equivalente a tu 'makeAppForTests' pero con lógica de singleton.
     */
    public static async getInstances(): Promise<TestInstances> {

        // CASO 1: Ya está creado. Devolverlo.
        if (TestSetup.instance) {
            return Promise.resolve(TestSetup.instance);
        }

        // CASO 2: Se está creando. Devolver la promesa existente.
        if (TestSetup.setupPromise) {
            return TestSetup.setupPromise;
        }

        // CASO 3: Primera vez. Crearlo.
        TestSetup.setupPromise = TestSetup.buildTestApp().then(inst => {
            TestSetup.instance = inst;      // Guardar el resultado
            TestSetup.setupPromise = null;  // Limpiar la promesa en curso
            return inst;
        }).catch(err => {
            TestSetup.setupPromise = null; // Limpiar en error
            throw err;
        });

        return TestSetup.setupPromise;
    }

    /**
     * Lógica de construcción (privada)
     */
    private static async buildTestApp(): Promise<TestInstances> {
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
        return { app: server.express, db };
    }

    /**
     * Método estático para el teardown global.
     */
    public static async close(): Promise<void> {
        if (TestSetup.instance && TestSetup.instance.db) {
            await TestSetup.instance.db.disconnect();
            TestSetup.instance = null;
        } else if (TestSetup.setupPromise) {
            // Caso raro: se pide cerrar mientras se está creando
            const inst = await TestSetup.setupPromise;
            await inst.db.disconnect();
            TestSetup.instance = null;
        }
    }
}