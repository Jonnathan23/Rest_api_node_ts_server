import { Router } from "express";
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProducts, getProductsById, updateAvailability, updateProduct } from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router()
/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The product name
 *                      example: Monitor Curvo de 49 pulgadas
 *                  price:
 *                      type: number
 *                      description: The products price
 *                      example: 300
 *                  avaibility:
 *                      type: boolean
 *                      description: The products avaibility
 *                      example: true
 *              
 * 
 * 
 * 
 */


/**
 * @swagger
 * /api/products:
 *      get:
 *          sumary: Get a list of products
 *          tags:
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
 * 
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *      get:
 *          sumary: Get a product by ID
 *          tags:
 *              - Products
 *          desctiption: Return a product based on its ID
 *          parameters:
 *            - in: path
 *              name: id
 *              description: The product ID
 *              required: true
 *              schema:
 *                  type: integer
 * 
 *          
 *          responses:
 *              200:
 *                  description: Succesful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Bad request - Invalid ID
 *              404:
 *                  description: Product not found
 * 
 * 
 */

router.get('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    getProductsById
)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     description: Create a new product with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      example: 'Monitor Curvo de 49 pulgadas'
 *                  price:
 *                      type: number
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      example: true
 
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Product'      
 *       400:
 *         description: Bad request - Invalid product information
 */
router.post('/',

    //Validation
    body('name').notEmpty().withMessage('El nombre del producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags:
 *       - Products
 *     description: Update a product with the provided information
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The product ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      example: 'Monitor Curvo de 49 pulgadas'
 *                  price:
 *                      type: number
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      example: true
 * 
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - Invalid product information
 *       404:
 *         description: Product not found
 */
router.put('/:id',
    param('id').isInt().withMessage('Id no válido'),
    body('name').notEmpty().withMessage('El nombre del producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio del producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product's availability
 *     tags:
 *       - Products
 *     description: Update a product's availability
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The product ID
 *         required: true
 *         schema:
 *           type: integer
 *     
 *     responses:
 *       200:
 *         description: Product's availability updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - Invalid availability
 *       404:
 *         description: Product not found
 */
router.patch('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    updateAvailability
)


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags:
 *       - Products
 *     description: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The product ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    deleteProduct

)
export default router