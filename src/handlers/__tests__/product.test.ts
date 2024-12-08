import request from 'supertest'
import server from '../../server'


describe('POST /api/products', () => {

    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price:"Hola"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
    })

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: -50
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
    })

    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(4)
        expect(response.body).toHaveProperty('errors')

    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 60
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
        
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('errors')
    })

})