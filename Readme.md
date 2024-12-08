# Backend

## Testing con JEST
Jest puede leer archivos de 3 formas:

* Archivos con la extensión .test.js
* Archivos con la extensión .spect.js
* Archivos dentro de la carpeta __tests__

### Instalación de dependencias

```bash
npm i -D supertest @types/supertest jest @types/jest ts-jest
```

### Crear archivo jest.config

```bash
npx ts-jest config:init
```

### Configuraciones

Configuración en el package.json para ejecutar tests

```json
"test": "jest --detectOpenHandles"
```

Para evitar llenar nuestra base de datos con los objetos que creamos en nuestros tests podemos limpiarla de esta forma

```ts
const clearDB = async () => {
    try {
        await db.sync({ force: true })
        console.log('Datos eliminados correctamente')
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}
// detectar el comando de nuestra terminal para ejecutar la función
if (process.argv[2] === '--clear') {
    clearDB()
}
```

Para ejecutar ese código de forma automática lo que podemos hacer es colocar el comando reservado ``"pretest"``, el cual se ejecuta automaticamente antes del comando ``"test"`` ,es decir, no es necesario llamarlo desde nuestra terminal
```json
"pretest": "ts-node ./src/data --clear"
```
### Code Coverage
Es una metrica utilizada para medir la cantidad de codigo cubierto por las pruebas.

#### Metricas de coverage
* < 60% -> No es suficiente
* 60% - 80% -> se puede mejorar
* >= 80% -> Es suficiente y una buena medida

Para ejecutar coverage, demos configurar nuestro package.json, colocar esto en nuestros scripts
```json
"test:coverage": "npm run pretest && jest --detectOpenHandles --coverage"
```

### Forzar errores
Para simular errores en nuestro código podemos utilizar ``mock``, le pasamos como parametro la ruta de nuestra variable, en este caso ``db``. Posterior a ello con ``spyOn()`` en su parametro le pasamos nuestra variable y el metetodo que quemaros observar su comportamiento, por ejemplo ``authenticate()`` en formato ``string``

````ts

jest.mock('../config/db')

describe('connect DB', () => {
    it('should hanlde databe connection error', async () => {
        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Error al conectar a la BD'))
        const consoleSpy = jest.spyOn(console, 'log')

        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error al conectar a la BD'))
    })
})
```