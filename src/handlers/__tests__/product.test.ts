import request from 'supertest'
import server from '../../server'
import { ExpressValidator } from 'express-validator'


describe('POST /api/products', () => {

    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: "Hola"
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

describe('GET /api/products', () => {

    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).not.toBe(404)
    })


    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('should return 404 a response for a non-exist product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('No se ha encontrado el producto')
    })

    it('should check a valid ID in the URL', async () => {
        const response = await request(server).get(`/api/products/not-valid-url`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no válido')

    })

    it('GET a JSON response for a single product', async () => {
        const response = await request(server).get(`/api/products/1`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

    })
})

describe('PUT /api/products/:id', () => {
    it('should check a valid ID in the URL', async () => {
        const response = await request(server).put(`/api/products/not-valid-url`).send({
            name: "Alexa con pantalla",
            price: 120,
            availability: true
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no válido')

    })

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate that the price is grater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Alexa con pantalla",
            price: 0,
            availability: true
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Alexa con pantalla",
            price: 130,
            availability: true
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('No se ha encontrado el producto')


        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const response = await request(server).put(`/api/products/1`).send({
            name: "Alexa con pantalla",
            price: 130,
            availability: true
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')


        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
        expect(response.body).not.toHaveProperty('error')
    })


})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async() => {
        const productId = 3000
        const response = await request(server).patch(`/api/products/${productId}`).send({
            price: 130
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('No se ha encontrado el producto')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const response = await request(server).patch(`/api/products/1`).send({
            price: 130
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
        expect(response.body).not.toHaveProperty('error')
    })
})


describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/invalid-url')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 3000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('No se ha encontrado el producto')

    })

    it('should delete a product', async () => {
        const response = await request(server).delete(`/api/products/1`)

        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto eliminado')

    })
})