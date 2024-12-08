import { Router } from "express";
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProducts, getProductsById, updateAvailability, updateProduct } from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router()

// Routing
router.get('/', getProducts)

router.get('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    getProductsById
)

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


router.patch('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    updateAvailability
)

router.delete('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    deleteProduct

)
export default router