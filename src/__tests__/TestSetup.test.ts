// En: src/__tests__/TestSetup.test.ts

// --- 1. MOCKS DE DEPENDENCIAS ---
// Simulamos las clases que 'buildTestApp' importa.
// Jest reemplazará las importaciones reales con estas versiones falsas.

// Creamos un mock de la instancia de la BD para poder espiarla
const mockDb = {
    connect: jest.fn(() => Promise.resolve(true)),
    disconnect: jest.fn(() => Promise.resolve(true)),
};

// Creamos un mock de la instancia de Express
const mockExpressApp = { get: jest.fn(), post: jest.fn() };

// Mockeamos los módulos
jest.mock('../config/db', () => ({
    DatabaseConnection: jest.fn(() => mockDb),
}));

jest.mock('../server', () => ({
    Server: jest.fn(() => ({
        express: mockExpressApp,
    })),
}));

jest.mock('../config/envs', () => ({
    envs: {
        // Proporciona cualquier env que tu clase necesite
        DATABASE_URL: 'mock-url',
        FRONTEND_URL: 'mock-url',
    },
}));

jest.mock('../routes', () => ({
    router: jest.fn(), // Un router falso
}));


jest.mock('../config/cors', () => ({
    CorsConfig: jest.fn(() => ({
        corsOptions: {}, // Opciones de cors falsas
    })),
}));


// --- 2. CONFIGURACIÓN DE LA PRUEBA ---

// Necesitamos re-importar la clase en cada test.
// Usaremos 'require' en lugar de 'import' para esto.
let TestSetup: any; // Tipo 'any' para poder acceder a los estáticos
let DatabaseConnection: jest.Mock; // Para espiar al constructor

describe('TestSetup Singleton Class', () => {

    beforeEach(() => {
        // LIMPIAR TODO ANTES DE CADA PRUEBA

        // 1. Resetea los contadores de todos los mocks (ej. .mock.calls.length)
        jest.clearAllMocks();

        // 2. ¡LA CLAVE! Resetea el caché de módulos
        // Esto fuerza a Jest a re-importar el archivo TestSetup.class.ts
        // y resetea sus variables estáticas (serverTest e inCreationProcess) a null.
        jest.resetModules();

        // 3. Re-importamos las clases AHORA que el caché está limpio
        // Usamos 'require' para poder hacerlo dentro de un 'beforeEach'
        TestSetup = require('./TestSetup.class.ts').TestSetup;
        DatabaseConnection = require('../config/db').DatabaseConnection;
    });


    // --- 3. LOS TESTS ---

    it('debería crear una nueva instancia (CASO 3)', async () => {
        const instances = await TestSetup.getInstances();

        // Verificamos que se haya construido
        expect(instances).toBeDefined();
        expect(instances.app).toBe(mockExpressApp); // Comprueba que es nuestra app mockeada
        expect(DatabaseConnection).toHaveBeenCalledTimes(1); // Se llamó al constructor
        expect(mockDb.connect).toHaveBeenCalledTimes(1); // Se llamó a connect()

        // Verificamos que el estado interno sea correcto
        expect(TestSetup.serverTest).toBe(instances);
        expect(TestSetup.inCreationProcess).toBe(null);
    });

    it('debería devolver la instancia existente (CASO 1)', async () => {
        // 1. Creamos la instancia
        const firstCall = await TestSetup.getInstances();

        // 2. Volvemos a pedirla
        const secondCall = await TestSetup.getInstances();

        // Verificamos que sea la misma
        expect(secondCall).toBe(firstCall);

        // ¡Prueba clave! El constructor y connect() NO se volvieron a llamar
        expect(DatabaseConnection).toHaveBeenCalledTimes(1);
        expect(mockDb.connect).toHaveBeenCalledTimes(1);
    });

    it('debería manejar llamadas paralelas (CASO 2)', async () => {
        // Lanzamos dos llamadas en paralelo
        const [firstCall, secondCall] = await Promise.all([
            TestSetup.getInstances(),
            TestSetup.getInstances(),
        ]);

        // Deberían recibir la misma instancia
        expect(firstCall).toBe(secondCall);
        expect(firstCall.app).toBe(mockExpressApp);

        // ¡Prueba clave! A pesar de las llamadas paralelas,
        // el constructor y connect() solo se llamaron UNA VEZ.
        expect(DatabaseConnection).toHaveBeenCalledTimes(1);
        expect(mockDb.connect).toHaveBeenCalledTimes(1);
    });

   

    it('debería cerrar la conexión (close() - camino feliz)', async () => {
        // 1. Creamos la instancia
        await TestSetup.getInstances();

        // 2. La cerramos
        await TestSetup.close();

        // Verificamos que se llamó a disconnect()
        expect(mockDb.disconnect).toHaveBeenCalledTimes(1);
        // Verificamos que el estado interno se limpió
        expect(TestSetup.serverTest).toBe(null);
    });

    it('debería manejar close() mientras se crea (close() - else if)', async () => {
        // Este es el test avanzado para las líneas 83-86

        // 1. Hacemos que 'connect' sea una promesa que podamos controlar
        let resolveConnect: any;
        const connectPromise = new Promise<boolean>(resolve => {
            resolveConnect = resolve;
        });
        mockDb.connect.mockReturnValue(connectPromise);

        // 2. Iniciamos la creación, PERO NO LA ESPERAMOS
        const instancesPromise = TestSetup.getInstances();

        // 3. Inmediatamente llamamos a close()
        // En este punto, serverTest es null, pero inCreationProcess NO es null
        // Esto fuerza la entrada en el 'else if'
        const closePromise = TestSetup.close();

        // 4. Ahora resolvemos la conexión de la BD
        resolveConnect(true);

        // 5. Esperamos a que ambas promesas terminen
        await instancesPromise;
        await closePromise;

        // Verificamos que, aunque la creación terminó,
        // el 'else if' de 'close' se activó y llamó a disconnect()
        expect(mockDb.disconnect).toHaveBeenCalledTimes(1);
        expect(TestSetup.serverTest).toBe(null);
    });
});