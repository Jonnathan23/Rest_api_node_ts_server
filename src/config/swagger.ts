import swaggerJsDoc from 'swagger-jsdoc'
import { SwaggerUiOptions } from 'swagger-ui-express'

const options : swaggerJsDoc.Options = {
    swaggerDefinition:{
        openapi: '3.0.2',
        tags:[
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info:{
            title: 'Products API Node.js / Express / Typescript',
            version: '1.0.0',
            description: 'API for managing products'
        }
    },
    apis: ['./src/routes.ts']
}

const swaggerSpec = swaggerJsDoc(options)

const swaggerUIOptions: SwaggerUiOptions = {
    customCss: `
    .topbar-wrapper .link{
        content: url('https://purina.com.ec/sites/default/files/styles/webp/public/2022-10/purina-10-datos-curiosos-sobre-los-gatos.png.webp?itok=rg1FkRuN');
        height: 120px;
        width: auto;
    }
    `
}

export default swaggerSpec
export { swaggerUIOptions }