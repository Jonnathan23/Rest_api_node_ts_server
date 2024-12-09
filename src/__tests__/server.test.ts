import  { connectDB } from '../server'
import db from '../config/db'


jest.mock('../config/db')

describe('connect DB', () => {
    it('should hanlde databe connection error', async () => {
        jest.spyOn(db, 'authenticate').mockRejectedValueOnce(new Error('Error al conectar a la BD'))
        const consoleSpy = jest.spyOn(console, 'log')

        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error al conectar a la BD'))
    })
})