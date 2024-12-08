import { Request, Response } from "express"
import Products from "../models/Product.mode"

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Products.findAll({
            order: [
                ['id', 'DESC']
            ],
            limit: 3,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
        res.json({ data: products })
    } catch (error) {
        console.log(error)
    }
}

export const getProductsById = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id)
        const { id } = req.params
        const product = await Products.findByPk(id)

        if (!product) return res.status(404).json({ error: 'No se ha encontrado el producto' })

        res.json(product)
    } catch (error) {
        console.log(error)
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        //Add products
        const product = await Products.create(req.body)
        res.json({ data: product })
    } catch (error) {
        console.log(error)
    }

}

export const updateProduct = async (req: Request, res: Response) => {

    const { id } = req.params
    const product = await Products.findByPk(id)

    if (!product) return res.status(404).json({ error: 'No se ha encontrado el producto' })

    // Actaulizar
    await product.update(req.body)
    await product.save()

    res.json({ data: product })
}

export const updateAvailability = async (req: Request, res: Response) => {

    const { id } = req.params
    const product = await Products.findByPk(id)

    if (!product) return res.status(404).json({ error: 'No se ha encontrado el producto' })

    // Actaulizar
    product.availability = !product.dataValues.availability
    await product.save()

    res.json({ data: product })
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await Products.findByPk(id)

    if (!product) return res.status(404).json({ error: 'No se ha encontrado el producto' })


    await product.destroy()
    res.status(200).json({ data: 'Producto eliminado' })

}