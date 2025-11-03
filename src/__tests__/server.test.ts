import { Sequelize } from 'sequelize-typescript'
import { DatabaseConnection, envs } from '../config'


describe('connect DB', () => {
    it('should handle database connection error', async () => {
        // Espía el método real de Sequelize (afecta a todas las instancias nuevas)
        const authSpy = jest
            .spyOn(Sequelize.prototype, 'authenticate')
            .mockRejectedValueOnce(new Error('Error al conectar a la BD'))

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

        const urlDatabase = envs.DATABASE_URL
        const databaseConnection = new DatabaseConnection({ ulrDatabase: urlDatabase, logging: true })

        await databaseConnection.connect()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error al conectar a la BD')
        )

        authSpy.mockRestore()
        consoleSpy.mockRestore()
    })
})